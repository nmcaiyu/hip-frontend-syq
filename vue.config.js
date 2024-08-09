const path = require('path')

let target = null
let proxy = null
let devServer = null

// target = 'http://123.59.26.103:81'
// target = 'http://192.168.3.165:8090'

if (target) proxy = { '/hip-api': { target } }

if (proxy) {
  devServer = { proxy }
} else {
  devServer = { before: require('./mock/mock-server.js') }
}

module.exports = {
  devServer,
  publicPath:
    process.env.VUE_APP_PUBLIC_PATH ? process.env.VUE_APP_PUBLIC_PATH : '/',
  // chainWebpack: config => {
  //   config.module
  //     .rule('svg')
  //     .exclude.add(path.resolve(__dirname, 'src/icons'))
  //     .end()
  //   config.module
  //     .rule('icons')
  //     .test(/\.svg$/)
  //     .include.add(path.resolve(__dirname, 'src/icons'))
  //     .end()
  //     .use('svg-sprite-loader')
  //     .loader('svg-sprite-loader')
  //     .options({
  //       symbolId: 'icon-[name]'
  //     })
  //     .end()
  // }
}
