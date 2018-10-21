//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js');
Page({
  data: {
    roleid: '2'
  },
  onLoad: function () {
    if (!wx.getStorageSync("token")) {
      utils.loginByWxchat()
    }
  },
  onShow: function(){
    let roleid = wx.getStorageSync('roleid');
    this.setData({
      roleid:roleid
    })
  }
})
 