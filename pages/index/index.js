//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js');
Page({
  data: {
    

  },
  onLoad: function () {
    if (!wx.getStorageSync("token")) {
      utils.loginByWxchat()
    }
  },
})
 