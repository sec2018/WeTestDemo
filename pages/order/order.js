// pages/order/order.js
const app = getApp();
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logisticsList: ['顺丰','申通','圆通'],
    logisticsIndex: 0,
    order:{
      shop_name: '',
      goods: '',
      num:'',
      info: ''
    },
    receiveAddress:{},
    sendAddress: {
      uname: '添加寄件人信息',
      tel: '',
      pro_city: '',
      detail_addr: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.receiveAddress = null;
    app.globalData.address = null;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getLogisticsList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData.receiveAddress)
    if (app.globalData.receiveAddress){
      this.setData({
        receiveAddress: app.globalData.receiveAddress
      })
    } else {
      this.setData({
        receiveAddress: {
          uname:'添加收件人信息',
          tel: '',
          pro_city: '',
          detail_addr: ''
        }
      })
    }
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
  //下单接口
  createOrder: function(){
    let _this = this;
    util.wxResquest({
      url: '/transport/api/searchaddr',
      method: 'GET',
      data: ''
    }, function (res) {
      let data = res.data.data;
      if (data.length > 0) {
        app.globalData.address = data[0];
        _this.setData({
          sendAddress: data[0]
        });
      }

    })
  },
  getAddressList: function () {
    let _this = this;
    util.wxResquest({
      url: '/transport/api/searchaddr',
      method: 'GET',
      data: ''
    }, function (res) {
      let data = res.data.data;
      if(data.length >0){
        app.globalData.address = data[0];
        _this.setData({
          sendAddress: data[0]
        });
      }
      
    })
  },
  //获取物流公司列表
  getLogisticsList: function(){
    let _this = this;
    util.wxResquest({
      url: '/transport/api/getcompanies',
      method: 'GET',
      data: ''
    }, function (res) {
      let data = res.data.data;
      if (data.length > 0) {
        _this.setData({
          logisticsList: data
        });
      }

    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      logisticsIndex: e.detail.value
    })
  },
  toAddressList: function (e) {
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
  toAddAddressList: function (e) {
    const flag = e.currentTarget.dataset.flag;
    const _this = this;
    console.log(flag)
    if (flag == 'receive'){ //填写收件地址，不保存在地址列表中
      wx.navigateTo({
        url: '../address/address?id=add&flag=receive',
      })
    } else {
      app.globalData.address = _this.data.sendAddress;
      wx.navigateTo({
        url: '../address/address?id='+_this.data.sendAddress.id,
      })
    }
  },
  bindNameInput: function(e){
    this.setData({
      'order.shop_name': e.detail.value
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