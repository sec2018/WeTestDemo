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
    address:null,
    apiRoot: 'http://wzjshuye.cn:8080'
  }
})