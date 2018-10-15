//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    let _this = this;
  },
  globalData: {
    userInfo: null,
    token:'1',
    code: null,
    receiveAddress: null, //下单时，保存地址时调用
    address:null, //修改地址时调用
    apiRoot: 'http://wzjshuye.cn:8080'
  }
})