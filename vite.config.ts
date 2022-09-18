import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [vue()],
  // 打包配置
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        // 移除console
        drop_console: true,
        // 移除debugger
        drop_debugger: true,
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: "internal:charset-removal",
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === "charset") {
                atRule.remove();
              }
            },
          },
        },
      ],
    },
    // css预处理器
    preprocessorOptions: {
      scss: {
        // 此处修改为要被预处理的scss文件地址
        additionalData:
          '@import "@/styles/variable.scss"; @import "@/styles/mixin.scss";',
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // 设置 `@` 指向 `src` 目录
      "@api": resolve(__dirname, "src/api"),
      "@comp": resolve(__dirname, "src/components"),
      "@util": resolve(__dirname, "src/utils"),
      "@mixins": resolve(__dirname, "src/mixins"),
      "@styles": resolve(__dirname, "src/mixins"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8081, // 设置服务启动端口号
    open: true, // 设置服务启动时是否自动打开浏览器
    // 代理
    proxy: {
      "/api": {
        target: "http://localhost:9000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
