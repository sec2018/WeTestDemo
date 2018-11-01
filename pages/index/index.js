//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js');
Page({
  data: {
    roleid: '2',
    isWxChatHid: true,
  },
  onLoad: function () {
    if (app.globalData.sdkVersion == -1){
      this.setData({
        isWxChatHid: false
      });
      wx.hideTabBar();
      return;
    } else {
      this.setData({
        isWxChatHid: true
      });
      wx.showTabBar();
    }
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
 