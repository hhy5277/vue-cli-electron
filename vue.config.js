const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const buildcfg = {
  title: 'vue-cli-electron',
  port: 80, // 本地服务端口号
  outputDir: 'dist', // 打包输出文件名
  publicPath: process.env.BASE_URL, // 打包后文件链接
  env: process.env.VUE_APP_ENV, // 环境变量值
  closeConsole: false, // 是否移除console
}

console.log(`环境变量：${buildcfg.env},
打包后文件baseURL：${buildcfg.publicPath},
是否移除console：${buildcfg.closeConsole}
`)
module.exports = {
  publicPath: buildcfg.publicPath,
  outputDir: buildcfg.outputDir,
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src/renderer'))
  },
  configureWebpack: (config) => {
    if (buildcfg.env === 'production') {
      buildcfg.closeConsole && config.plugins.push(
        new TerserPlugin({
          terserOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log']
            }
          }
        })
      )
    }
    config.mode = process.env.NODE_ENV
  },
  devServer: {
    open: false,
    disableHostCheck: true,
    port: buildcfg.port,
  },
  pages: {
    index: {
      entry: 'src/renderer/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: buildcfg.title,
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    loader: 'src/loader/main.js'
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/main/index.js',
      mainProcessWatch: ['src/main'],
      builderOptions: {
        appId: process.env.VUE_APP_APPID,
        productName: process.env.VUE_APP_PRODUCTNAME,
        extraMetadata: {
          name: process.env.VUE_APP_APPID.split('.').pop(),
          version: process.env.VUE_APP_VERSION
        },
        asar: true,
        directories: {
          output: "dist_electron",
          buildResources: "build",
          app: "dist_electron/bundled"
        },
        files: [
          {
            filter: [
              "**"
            ]
          }
        ],
        extends: null,
        electronVersion: "11.3.0",
        extraResources: [],
        electronDownload: {
          mirror: "https://npm.taobao.org/mirrors/electron/"
        },
        dmg: {
          contents: [
            {
              type: "link",
              path: "/Applications",
              x: 410,
              y: 150
            },
            {
              type: "file",
              x: 130,
              y: 150
            }
          ]
        },
        mac: {
          icon: "public/icons/icon.icns"
        },
        nsis: {
          oneClick: false,
          perMachine: true,
          allowToChangeInstallationDirectory: true,
          warningsAsErrors: false,
          allowElevation: false,
          createDesktopShortcut: true,
          createStartMenuShortcut: true
        },
        win: {
          target: "nsis",
          icon: "public/icons/icon.ico",
          requestedExecutionLevel: "highestAvailable"
        },
        linux: {
          "icon": "public/icons"
        },
        publish: {
          provider: "generic",
          url: "http://127.0.0.1"
        }
      }
    }
  }
}