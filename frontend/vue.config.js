const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '^/test$': {
        target: 'http://localhost:8000',
        ws: true,
        changeOrigin: true
      }
    },
    client: {
      webSocketURL: 'ws://localhost:8080/ws'
    }
  }
})