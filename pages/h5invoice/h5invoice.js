const app = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    token:'',
    QrCodeUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        id: options.id,
        token: wx.getStorageSync('token')
      })
      this.getImg();
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
  seeImage(){
    wx.previewImage({
      current: this.data.QrCodeUrl, // 当前显示图片的http链接
      urls: [this.data.QrCodeUrl] // 需要预览的图片http链接列表
    })
  },
  getImg:function(){
    let _this = this;
    // wx.request({
    //   // url: '/transport/api/deleteaddr',
    //   url: 'http://10.84.8.247:8080/transport/billvoice.html',
    //   data: { 'id': _this.id, 'token': _this.token},
    //   method: 'GET',
    //   success: function success(res) {
    //     const base64 = wx.arrayBufferToBase64(res.data);
    //     //_this.setData({ QrCodeUrl: "data:image/png;base64," + base64 });
    //     _this.setData({ QrCodeUrl: base64 });
    //   }
    // })
    console.log(_this.data.id)
    util.wxResquest({
      url: '/transport/api/getImg',
      method: 'GET',
      data: { 'id': _this.data.id }
    }, function (res) {
        // let base64 = wx.arrayBufferToBase64(res.data.data);
        //_this.setData({ QrCodeUrl: "data:image/png;base64," + base64 });
        // let _data = "data:image/png;base64," + base64;
      let _data = "data:image/png;base64,"+ decodeURI(res.data.data);
      // // _this.setData({ QrCodeUrl: _data });
      _this.setData({ QrCodeUrl: _data });
      wx.previewImage({
        current: _data, // 当前显示图片的http链接
        urls: [_data] // 需要预览的图片http链接列表
      })

      // var data = res.data.data;
      // var array = wx.base64ToArrayBuffer(data);
      // var base64 = wx.arrayBufferToBase64(array);
      // _this.setData({ QrCodeUrl: "data:image/png;base64," + base64 });
    })
  },
  bluetoothprint: function () {
    wx.navigateTo({
      url: '../bluetooth/bluetooth'
    })
  }

})