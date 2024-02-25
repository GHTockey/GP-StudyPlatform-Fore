/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,vue}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'tce-shadow': 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
      }
    },
  },
  plugins: [
    // daisyUI
    require('daisyui'),
  ],
  corePlugins: {
    // 关闭预设的一些样式
    preflight: false,
  },
  daisyui: {
    // styled: false, // 是否启用 daisyUI 样式 (默认为 true)

    // themes: ["light", "dark", "cupcake", "aqua", "nord"], // 主题列表
    // darkTheme: "xxx", // 指定暗夜主题(默认为 dark)
    // 默认主题在 HTML 文件中配置，没有配置则根随操作系统主题
    themes: [
      {
        mytheme: {
          // "primary": "#1677ff",
          "primary": "#2563eb",
          "secondary": "#c084fc",
          "accent": "#2dd4bf",
          "neutral": "#6b7280",
          "base-100": "#ffffff",
          "info": "#0e7490",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#e11d48",
        },
      },
      "dark",
      "cupcake"
    ],
  }
}

