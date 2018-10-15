// pages/add_address/add_address.js
const app = getApp();
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[1,2,2,3]
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
    this.getAddressList();
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
  getListMore: function(){
    
  },
  //编辑收货地址
  editAddress: function(e){
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    app.globalData.address = this.data.list[index];
    wx.navigateTo({
      url: '../address/address?id='+id,
    })
  },
  //删除地址
  delAddress: function(e){
    const id = e.currentTarget.dataset.id;
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '是否删除此地址',
      success: function() {
        util.wxResquest({
          url: '/transport/api/deleteaddr',
          method: 'POST',
          data: { id: id }
        }, function (res) {
          wx.showToast({
            title: '删除成功'
          });
          _this.getAddressList();

        })
      }
    })
   
  },
  //设置默认地址
  radioChange: function(e){
    console.log(e.detail.value)
  },
  getAddressList: function(){
    let _this =this;
    util.wxResquest({
      url: '/transport/api/searchaddr',
      method: 'GET',
      data: ''
    }, function(res){
      let data = res.data.data;
      _this.setData({
        list: data
      });
    })
  }
})