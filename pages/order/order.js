// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logisticsList: ['顺丰','申通','圆通'],
    logisticsIndex: 0,
    order:{
      name: '',
      goods: '',
      num:'',
      info: ''
    }
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
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      logisticsIndex: e.detail.value
    })
  },
  toAddAddressList: function () {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  toAddressList: function () {
    wx.navigateTo({
      url: '../add_address/add_address',
    })
  },
  bindNameInput: function(e){
    this.setData({
      'order.name': e.detail.value
    });
  },
  bindGoodsInput: function (e) {
    this.setData({
      'order.goods': e.detail.value
    });
  },
  bindNumInput: function (e) {
    this.setData({
      'order.num': e.detail.value
    });
  },
  bindInfoInput: function (e) {
    this.setData({
      'order.info': e.detail.value
    });
  }
})