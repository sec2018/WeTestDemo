//app.js
function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  var len = Math.max(v1.length, v2.length)
  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }
  for (var i = 0; i < len; i++) {
    var num1 = parseInt(v1[i])
    var num2 = parseInt(v2[i])
    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}
App({
  onLaunch: function() {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.globalData.platform = res.platform;
        var SDKVersion = res.SDKVersion;
        _this.globalData.sdkVersion = compareVersion(SDKVersion, '2.3.0');
        console.log(SDKVersion + ' ' + _this.globalData.sdkVersion)

      }
    })

  },
  globalData: {
    userInfo: null,
    token:'1',
    code: null,
    iv: null,
    sdkVersion: 0,
    encryptedData: null,
    receiveAddress: null, //下单时，保存地址时调用
    address:null, //修改地址时调用
    apiRoot: 'https://wzjshuye.cn:8882'
    //apiRoot: 'http://192.168.100.107:8882'
    //apiRoot: 'http://10.84.8.190:8882'
  }
})  