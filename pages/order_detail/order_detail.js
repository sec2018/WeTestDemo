// pages/order_detail/order_detail.js
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    roleid: '',
    company_code:'',
    delivery_fee:''
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
    let data = wx.getStorageSync('orderDetail');
    data.create_time = this.timeformat(data.create_time);
    data.rec_time = this.timeformat(data.rec_time);
    data.pay_time = this.timeformat(data.pay_time);
    data.finish_time = this.timeformat(data.finish_time);
    this.setData({
      detail:data
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let roleid = wx.getStorageSync('roleid');
    this.setData({
      roleid:roleid
    })
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
  receiveBill(){
    let _this = this;
    let dataParam = {
      id: _this.data.detail.id
    }
    utils.wxResquest({
      url: '/transport/api/receivebill',
      data: dataParam,
      method: 'POST'
    }, function (res) {
      if (res.data.success) {
        wx.showToast({
          title: res.data.msg,
          duration: 2000
        });
        setTimeout(function () {
          wx.hideToast();
          wx.navigateBack({
            delta: '1'
          })
        }, 1800)
      }
    })
  },
  payBill() {
    let _this = this;
    let dataParam = {
      id: _this.data.detail.id
    }
    utils.wxResquest({
      url: '/transport/api/paybill',
      data: dataParam,
      method: 'POST'
    }, function (res) {
      if (res.data.success) {
        wx.showToast({
          title: res.data.msg,
          duration: 2000
        });
        setTimeout(function () {
          wx.hideToast();
          wx.navigateBack({
            delta: '1'
          })
        }, 1800)
      }
    })
  },
  finishBill() {
    let _this = this;
    let dataParam = {
      id: _this.data.detail.id,
      company_code: _this.data.company_code,
      delivery_fee: _this.data.delivery_fee
    }
    utils.wxResquest({
      url: '/transport/api/finishbill',
      data: dataParam,
      method: 'POST'
    }, function (res) {
      if (res.data.success) {
        wx.showToast({
          title: res.data.msg,
          duration: 2000
        });
        setTimeout(function () {
          wx.hideToast();
          wx.navigateBack({
            delta: '1'
          })
        }, 1800)
      }
    })
  },
  createinvoice() {
    let _this = this;
    console.log(_this.data.detail.id)
    let id  = _this.data.detail.id
    wx.navigateTo({
      url: '../invoice/invoice?id='+id
    })
  },
  seeinvoice() {
    let _this = this;
    console.log(_this.data.detail.id)
    let id = _this.data.detail.id;
    // wx.request({
    //   url: 'http://10.84.8.247:8080/transport/billvoice.html',
    //   data: { 'id': _this.id, 'token': _this.token},
    //   method: 'GET',
    //   success: function success(res) {
    //     console.log("存入imgbase");
    //     wx.navigateTo({
    //       url: '../h5invoice/h5invoice?id=' + id
    //     })
    //   }
    // })
    wx.navigateTo({
      url: '../h5invoice/h5invoice?id=' + id
    })
  },
  timeformat(time){
    if(!time){return null}
    console.log(time);
    let d = new Date(time);
    if((time+"").indexOf('+0000')>0){
      d = new Date(time.replace('+0000', 'Z'));
    }
   
    let _time = d.getFullYear() + "-" + ((d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : "0" + (d.getMonth() + 1)) + "-" + ((d.getDate() >= 10 ? d.getDate() : "0" + d.getDate())) + " "
      + (d.getHours() >= 10 ? d.getHours() : "0" + d.getHours()) + ":" + (d.getMinutes() >= 10 ? d.getMinutes() : "0" + d.getMinutes()) + ":" + (d.getSeconds() >= 10 ? d.getSeconds() : "0" + d.getSeconds());
    // let _time =  time.replace('+0000', 'Z');
    return _time;
  },
  bindCompanyCodeInput: function (e) {
    this.setData({
      'company_code': e.detail.value
    });
  },
  bindDeliveryfeeInput: function (e) {
    this.setData({
      'delivery_fee': e.detail.value
    });
  }
})
