// src/types/image.ts
export interface TextImageArgs {
  text: string;
  secertId: string;
  secertKey: string;
}

export interface TencentImageResponse {
  Response: {
    ImgUrl?: string;
    RequestId: string;
    Error?: {
      Code: string;
      Message: string;
    };
  };
}

export interface ImageGenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  requestId?: string;
}

// 类型保护函数，用于检查 TextImageArgs 类型
export function isValidTextImageArgs(args: any): args is TextImageArgs {
  return (
    typeof args === "object" &&
    args !== null &&
    "text" in args &&
    typeof args.text === "string" &&
    "secertId" in args &&
    typeof args.secertId === "string" &&
    "secertKey" in args &&
    typeof args.secertKey === "string"
  );
}
