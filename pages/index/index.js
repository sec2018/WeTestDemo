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
    //   url: '../register_info/register_info?id=4',
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
  },
  toMulitOrder(){
    wx.navigateTo({
      url: '../mulit_order/mulit_order',
    })
  },
  topanyLine(){
    wx.navigateTo({
      url: '../company_line/company_line',
    })
  },
  otherToast(){
    wx.showModal({
      title: '提示',
      content: '此功能尚未开通',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})
 