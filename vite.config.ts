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
  // 开启控制台输出日志
  silent: false,
  // 是否开启 https
  https: false,
  // 服务端渲染
  ssr: false,
  // 打包后的根路径
  base: './',
  // 入口
  entry: './pubilc/index.html',
  // 出口
  outDir: 'dist',
  // 输出的静态资源的文件夹名称
  assetsDir:'assets',
  // 哪个第三方的包需要重新编译
  optimizeDeps:[],
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