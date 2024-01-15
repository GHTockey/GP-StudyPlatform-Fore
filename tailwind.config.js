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

    themes: ["light", "dark", "cupcake", "aqua", "nord"], // 主题列表
    darkTheme: "light", // 指定暗夜主题(默认为 dark)
    // themes: [
    //   {
    //     mytheme: {
    //       primary: "#282828",
    //       secondary: "#f6d860",
    //       accent: "#37cdbe",
    //       neutral: "#3d4451",
    //       'base-100': "#ffffff",
    //     }
    //   },
    //   "dark",
    //   "cupcake"
    // ]
  }
}

