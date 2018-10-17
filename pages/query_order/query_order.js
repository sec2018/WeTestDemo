// pages/query_order/query_order.js

const app = getApp();
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [1, 2, 2, 3],
    fromOrder: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.flag == 'receive') {
      this.setData({
        fromOrder: 'receive'
      })
    } else if (options.flag == 'send') {
      this.setData({
        fromOrder: 'send'
      })
    }
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
    this.getUnfinishedList();
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
  getUnfinishedList: function () {
    let _this = this;
    util.wxResquest({
      url: '/transport/api/getuserunfinishbill',
      method: 'GET',
      data: {sender_id:1}
    }, function (res) {
      let data = res.data.data;
      _this.setData({
        list: data
      });
    })
  },
  getFinishedList:function(){
    let _this = this;
    util.wxResquest({
      url: '/transport/api/getuserfinishedbill',
      method: 'GET',
      data: { sender_id: 1 }
    }, function (res) {
      let data = res.data.data;
      _this.setData({
        list: data
      });
    })
  }
})
