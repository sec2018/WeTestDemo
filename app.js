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
    iv: null,
    encryptedData: null,
    receiveAddress: null, //下单时，保存地址时调用
    address:null, //修改地址时调用
    // apiRoot: 'http://wzjshuye.cn:8080'
    //apiRoot: 'http://192.168.100.107:8080'
    apiRoot: 'http://10.84.8.247:8080'
  }
})  