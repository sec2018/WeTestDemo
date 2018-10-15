//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js');
Page({
  data: {
    tabsIndex:0,

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (!wx.getStorageSync("token")) {
      utils.loginByWxchat()
    }
  },
  tabClick: function(e){
    // const id = e.target.dataset.id;
    // this.setData({
    //   tabsIndex: id
    // })
  }
})
 