#!/usr/bin/env node

/**
 * Image Generation MCP Server
 * Integrates with Tencent Cloud AI Art (aiart) to generate images from text prompts
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import crypto from "crypto";
import { isValidTextImageArgs, ImageGenerationResult } from "./types/image.js";

class ImageServer {
  private server: Server;
  private axiosInstance;
  private readonly TENCENT_API_ENDPOINT = "https://aiart.tencentcloudapi.com";
  private readonly SERVICE = "aiart";
  private readonly ACTION = "TextToImage";
  private readonly VERSION = "2022-12-29";
  private readonly REGION = "ap-guangzhou";

  constructor() {
    this.server = new Server(
      {
        name: "image-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // 配置 axios 实例
    this.axiosInstance = axios.create({
      baseURL: this.TENCENT_API_ENDPOINT,
      timeout: 30000,
    });

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers(): void {
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(
      ListToolsRequestSchema,
      async () => ({
        tools: [
          {
            name: "text_image",
            description: "Generate image from text prompt using Tencent Cloud AI Art",
            inputSchema: {
              type: "object",
              properties: {
                text: {
                  type: "string",
                  description: "Text prompt for image generation",
                },
                secertId: {
                  type: "string",
                  description: "Tencent Cloud account secret ID",
                },
                secertKey: {
                  type: "string",
                  description: "Tencent Cloud account secret key",
                },
              },
              required: ["text", "secertId", "secertKey"],
            },
          },
        ],
      })
    );

    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request: any) => {
        if (request.params.name !== "text_image") {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
        }

        if (!isValidTextImageArgs(request.params.arguments)) {
          throw new McpError(
            ErrorCode.InvalidParams,
            "Invalid text image arguments"
          );
        }

        const { text, secertId, secertKey } = request.params.arguments;

        try {
          const result = await this.generateImage(text, secertId, secertKey);

          if (result.success) {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      success: true,
                      message: "Image generated successfully",
                      imageUrl: result.imageUrl,
                      requestId: result.requestId,
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          } else {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      success: false,
                      error: result.error,
                    },
                    null,
                    2
                  ),
                },
              ],
              isError: true,
            };
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    success: false,
                    error: `Image generation failed: ${errorMessage}`,
                  },
                  null,
                  2
                ),
              },
            ],
            isError: true,
          };
        }
      }
    );
  }

  /**
   * Generate image using Tencent Cloud AI Art API
   */
  private async generateImage(
    prompt: string,
    secretId: string,
    secretKey: string
  ): Promise<ImageGenerationResult> {
    try {
      // Prepare request parameters
      const payload = {
        Prompt: prompt,
      };

      // Generate signature
      const timestamp = Math.floor(Date.now() / 1000);
      const date = new Date(timestamp * 1000).toISOString().split("T")[0];

      const signature = this.generateTencentSignature(
        secretId,
        secretKey,
        this.ACTION,
        JSON.stringify(payload),
        timestamp,
        date
      );

      // Make API request
      const response = await this.axiosInstance.post("/", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: signature,
          "X-TC-Action": this.ACTION,
          "X-TC-Timestamp": timestamp.toString(),
          "X-TC-Version": this.VERSION,
          "X-TC-Region": this.REGION,
        },
      });

      // Handle response
      const responseData = response.data?.Response;

      if (responseData?.Error) {
        return {
          success: false,
          error: `${responseData.Error.Code}: ${responseData.Error.Message}`,
        };
      }

      // Handle image URL response
      if (responseData?.ImgUrl) {
        return {
          success: true,
          imageUrl: responseData.ImgUrl,
          requestId: responseData.RequestId,
        };
      }

      // Handle array of images
      if (responseData?.ResultImage && Array.isArray(responseData.ResultImage)) {
        return {
          success: true,
          imageUrl: responseData.ResultImage[0],
          requestId: responseData.RequestId,
        };
      }

      return {
        success: false,
        error: `Unexpected API response: ${JSON.stringify(responseData)}`,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        const errorMessage =
          errorData?.Response?.Error?.Message ||
          error.message ||
          "Unknown API error";
        return {
          success: false,
          error: `API Error: ${errorMessage}`,
        };
      }
      throw error;
    }
  }

  /**
   * Generate Tencent Cloud API signature (TC3-HMAC-SHA256)
   */
  private generateTencentSignature(
    secretId: string,
    secretKey: string,
    action: string,
    payload: string,
    timestamp: number,
    date: string
  ): string {
    // Step 1: Create canonical request
    const httpMethod = "POST";
    const canonicalUri = "/";
    const canonicalQueryString = "";
    const canonicalHeaders = `content-type:application/json\nhost:aiart.tencentcloudapi.com\n`;
    const signedHeaders = "content-type;host";
    const hashedPayload = crypto
      .createHash("sha256")
      .update(payload)
      .digest("hex");

    const canonicalRequest = `${httpMethod}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${hashedPayload}`;

    // Step 2: Create string to sign
    const algorithm = "TC3-HMAC-SHA256";
    const hashedCanonicalRequest = crypto
      .createHash("sha256")
      .update(canonicalRequest)
      .digest("hex");
    const credentialScope = `${date}/${this.SERVICE}/tc3_request`;
    const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${hashedCanonicalRequest}`;

    // Step 3: Calculate signature
    const secretDate = crypto
      .createHmac("sha256", `TC3${secretKey}`)
      .update(date)
      .digest();
    const secretService = crypto
      .createHmac("sha256", secretDate)
      .update(this.SERVICE)
      .digest();
    const secretSigning = crypto
      .createHmac("sha256", secretService)
      .update("tc3_request")
      .digest();
    const signature = crypto
      .createHmac("sha256", secretSigning)
      .update(stringToSign)
      .digest("hex");

    // Step 4: Create authorization header
    const authorization = `${algorithm} Credential=${secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return authorization;
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.error("Image MCP server running on stdio");
  }
}

const server = new ImageServer();
server.run().catch(console.error);
