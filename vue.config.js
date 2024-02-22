const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}


module.exports = {

  productionSourceMap: false,// 生产环境是否要生成 sourceMap

  publicPath: './',  //   部署应用包时的基本 URL

  outputDir: 'dist',  //   打包时输出的文件目录

  assetsDir: 'static',  //   放置静态文件夹目录

  devServer:{},// dev环境下，webpack-dev-server 相关配置

  lintOnSave: false,//是否在开发环境下每次保存代码时都启用 eslint验证

  configureWebpack: {},

  css:{},// css的处理

  chainWebpack: config=>{
    config.plugin('html')
        .tap(args => {
          args[0].favicon = './public/logo.png';
          return args;
        })
  }, //vue-cli内部的webpack配置

  pluginOptions: {},// 可以用来传递任何第三方插件选项

  // experiments:{
  //   asyncWebassembly:true
  // }

}
