// pages/login/login.js
const app = getApp();
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '2', value: '商户', checked: 'true' },
      { name: '3', value: '承运员' },
      { name: '4', value: '物流公司' }
    ],
    roleid: '2'
  },
  radioChange: function (e) {
    let id = e.detail.value;
    this.setData({
      roleid: id
    })
  },
  getUserinfo: function(e){
    const userRes = e.detail;
    wx.setStorageSync('roleid', this.data.roleid);
    utils.loginByWxchat();
  }
})