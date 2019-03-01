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
  // payBill() {
  //   let _this = this;
  //   let dataParam = {
  //     id: _this.data.detail.id,
  //     total_fee: _this.data.detail.price,
  //     attach: _this.data.detail.shop_name,
  //     body: _this.data.detail.goodsname
  //   }
  //   utils.wxResquest({
  //     url: '/transport/api/payment',
  //     data: dataParam,
  //     method: 'POST'
  //   }, function (res) {
  //     if (res.data.success) {
  //       let pay = res.data;
  //       wx.requestPayment({
  //         'timeStamp': pay[0].timeStamp,
  //         'nonceStr': pay[0].nonceStr,
  //         'package': pay[0].package,
  //         'signType': 'MD5',
  //         'paySign': pay[0].paySign,
  //         // 'success': function (res) {
  //         //   wx.navigateBack({
  //         //     delta: 1
  //         //   })
  //         // },
  //         // 'fail': function (event) {
  //         // }

  //       })
  //     } else {
  //       wx.showToast({
  //         title: res.data.msg,
  //         duration: 2000
  //       });
  //     }
  //   })
  // },


  payBill() {
    let _this = this;
    let dataParam = {
      order_id: _this.data.detail.id,
      total_fee: _this.data.detail.price,
      attach: _this.data.detail.shop_name,
      body: _this.data.detail.goodsname
    }
    utils.wxResquest({
      url: '/transport/api/payment',
      data: dataParam,
      method: 'POST'
    }, function (res) {
        var pay = res.data.data;
        console.log(res)
        //发起支付 
        let timeStamp = pay.timeStamp;
        let packages = pay.package;
        let paySign = pay.paySign;
        let nonceStr = pay.nonceStr;
        let param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
        _this.pay(param);
    })
  },
  /* 支付   */
  pay: function (param) {
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面 
          success: function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
          },
          cancel: function (res){

          },
          fail: function (res) {
            // fail 
          },
          complete: function () {
            // complete 
          }
        })
      },
      fail: function (res) {
        // fail 
        console.log(res);
      },
      complete: function () {
        // complete 
        console.log("pay complete");
      }
    })
  },
  

  /* 退款测试   */
  refundBill() {
    let _this = this;
    let dataParam = {
      // order_id: _this.data.detail.id,
      order_id: 17,
      total_fee: _this.data.detail.price,
      // out_trade_no: _this.data.detail.out_trade_no,
      out_trade_no:"15267985512019030109481420262643",
      attach: _this.data.detail.shop_name
    }
    utils.wxResquest({
      url: '/transport/api/refund',
      data: dataParam,
      method: 'POST'
    }, function (res) {
      console.log(res);
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
