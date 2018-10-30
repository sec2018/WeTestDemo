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
    // wx.navigateTo({
    //   url: '../mulit_order/mulit_order',
    // })
    let roleid = wx.getStorageSync('roleid');
    if(!roleid){
      wx.navigateTo({
        url: '../login/login',
      })
    }
    this.setData({
      roleid:roleid
    })
  }
})
 