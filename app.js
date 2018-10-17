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
    apiRoot: 'http://wzjshuye.cn:8080',
<<<<<<< HEAD
    //apiRoot: 'http://192.168.100.107:8080',
=======
    // apiRoot: 'http://192.168.100.107:8080',
>>>>>>> e73a37ff910c54543e7bc8465bb65ca89c6ec3c1
  }
})