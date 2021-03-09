const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // 公共路径(必须有的)
  publicPath: './',
  // 输出文件目录
  outputDir: 'dist',
  // 静态资源存放的文件夹(相对于ouputDir)
  assetsDir: `static`,
  // eslint-loader 是否在保存的时候检查(果断不用，这玩意儿我都没装)
  lintOnSave: false,
  filenameHashing: false,
  // 我用的only，打包后小些
  runtimeCompiler: false,
  productionSourceMap: false, // 不需要生产环境的设置false可以减小dist文件大小，加速构建
  devServer: {
    port: 8001,
    disableHostCheck: true
  },
  chainWebpack(config) {
    config.resolve.alias
      .set('@', path.join(__dirname, 'src'))
    // 移除 preload 插件
    config.plugins.delete('preload')
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end()
    // 第二步：使用svg-sprite-loader 对 src/assets/imgs/svgs下的svg进行操作
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .end()
    config.set('externals', {
      mockjs: 'Mock',
      ueditor: 'UE'
    })
  },
  configureWebpack: {
    optimization: {
      runtimeChunk: {
        name: 'manifest'
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: process.env.NODE_ENV !== 'production',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
      })
    ],
    //重点
    output: {
      // 输出重构 打包编译后的js文件名称,添加时间戳.
      filename: `static/js/[name].js`,
      chunkFilename: `static/js/[name].js`
    }
  },
  css: {
    //重点.
    extract: {
      // 打包后css文件名称添加时间戳
      filename: `static/css/[name].css`,
      chunkFilename: `static/css/[name].css`
    }
  }
}
