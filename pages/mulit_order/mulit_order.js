// pages/mulit_order/mulit_order.js
const app = getApp();
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendAddress: {
      sender_name: '添加寄件人信息',
      tel: '',
      pro_city: '',
      detail_addr: ''
    },
    closeDialog: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.address) {
      this.setData({
        sendAddress: app.globalData.address
      })
    } else {
      this.getAddressList();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  toAddressList: function(e) {
    const flag = e.currentTarget.dataset.flag;
    const _this = this;
    console.log(flag)
    if (flag == 'receive') { //填写收件地址，不保存在地址列表中
      wx.navigateTo({
        url: '../add_address/add_address?flag=receive',
      })
    } else {
      app.globalData.address = _this.data.sendAddress;
      wx.navigateTo({
        url: '../add_address/add_address?flag=send',
      })
    }
  },
  openDialogHandle() {
    this.setData({
      closeDialog: false
    })
  },
  closeDialogHandle() {
    this.setData({
      closeDialog: true
    })
  },
  getAddressList: function() {
    let _this = this;
    util.wxResquest({
      url: '/transport/api/searchaddr',
      method: 'GET',
      data: ''
    }, function(res) {
      let data = res.data.data;
      if (data.length > 0) {
        console.log(data);
        app.globalData.address = data[0];
        _this.setData({
          sendAddress: data[0]
        });
      }

    })
  },
  //保存下单的接口
  saveOrderAjax(e) {
    let _this = this;
    let data = e.detail;
    //加上寄件人地址
    let param = Object.assign({}, data, {
      sender_name: _this.data.sendAddress.uname,
      sender_procity: _this.data.sendAddress.pro_city,
      sender_detailarea: _this.data.sendAddress.detail_addr,
      sender_tel: _this.data.sendAddress.tel,
    })
    console.log(param)
    //调用保存按钮，保存成功后，将closeDialog设置为false
  }
})