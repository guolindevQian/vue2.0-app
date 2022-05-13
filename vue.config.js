module.exports = {
  lintOnSave: 'warning',//可以设置为false 关闭eslint 警告提示 不会导致编译失败
  publicPath: "./",
  outputDir: './dist',
  assetsDir: "static",
  devServer: {

    open: process.platform === 'darwin',
    disableHostCheck: true,
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: { // 配置如下代码
      '/api': {
        target: 'http://172.16.2.1:8080', // 你请求的第三方接口
        ws: true,
        changeOrigin: true,
        pathRewrite: {  // 路径重写，
          '^/api': ''  // 
        }
      },
    },
    before: app => { }

  },
};
