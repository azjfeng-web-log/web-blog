import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import RefreshPlugin from "@rspack/plugin-react-refresh";

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];

export default defineConfig({
  context: __dirname,
  entry: {
    main: "./src/main.tsx",
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
    alias: {
      "@src": path.resolve(__dirname, "src"), // 设置路径别名
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: { targets },
            },
          },
        ],
      },
      //   {
      //     test: /\.css$/,
      //     use: [
      //       {
      //         loader: "postcss-loader",
      //         options: {
      //           postcssOptions: {
      //             plugins: {
      //               tailwindcss: {},
      //               autoprefixer: {},
      //             },
      //           },
      //         },
      //       },
      //     ],
      //     type: "css",
      //   },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"], // 处理 CSS 文件
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    isDev ? new RefreshPlugin() : null,
  ].filter(Boolean),
  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: { targets },
      }),
    ],
  },
  //   experiments: {
  //     css: true,
  //   },
  devServer: {
    proxy: [
      {
        context: () => true,
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    ],
  },
});
