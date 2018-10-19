// pages/login/login.js
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '1', value: '商户', checked: 'true' },
      { name: '2', value: '快递员' },
      { name: '3', value: '物流公司' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  getUserinfo: function(e){
    const userRes = e.detail;
    console.log(userRes)
    utils.loginAjax({
      encryptedData: userRes.encryptedData,
      iv: userRes.iv
    }, function (){
      wx.setStorageSync('userInfo', userRes.userInfo);
      wx.navigateBack({
        delta: '1'
      })
    })
  }
})