/*
 * @Author: lzy
 * @Date: 2021-03-21 9:36:13
 * @Title: 
 * @Description: 此页面配置完成一定要重启
 */
const path = require('path')
// vite.config.js # or vite.config.ts

module.exports = {
  alias: {
    // 键必须以斜线开始和结束
    '/@/': path.resolve(__dirname, './src')
  },
  // hostname: 'capgemini',
  port: 8080,
  // 是否自动在浏览器打开
  open: true,
  // 是否开启 https
  https: false,
  // 服务端渲染
  ssr: false,
  /**
   * 在生产中服务时的基本公共路径。
   * @default '/'
   */
  base: './',
  /**
   * 与“根”相关的目录，构建输出将放在其中。如果目录存在，它将在构建之前被删除。
   * @default 'dist'
   */
  outDir: 'dist',
  //配置全局样式变量
  cssPreprocessOptions: {
    scss: {
      additionalData: '@import "./src/assets/scss/style.scss";' // 添加公共样式
    }
  }
  // 反向代理
  // proxy: {
  //   '/api': {
  //     target: '',
  //     changeOrigin: true,
  //     rewrite: path => path.replace(/^\/api/, '')
  //   }
  // }
}