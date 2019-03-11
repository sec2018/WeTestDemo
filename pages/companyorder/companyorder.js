// pages/order/order.js
const app = getApp();
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    company_id: 0,
    userInfo: '',
    order: {
      shopname: '',
      goodsname: '',
      goodsnum: '',
      billinfo: '',
      price: 0,
      companycode: ''
    },
    receiveAddress: {},
    sendAddress: {
      sender_name: '添加寄件人信息',
      tel: '',
      pro_city: '',
      detail_addr: ''
    },
    lng: '',
    lat: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.receiveAddress = null;
    app.globalData.address = null;
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getCompanyInfo();
    var that = this;
    wx.getLocation({
      // type: 'wgs84',
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          lat: latitude,
          lng: longitude
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData.receiveAddress)
    if (app.globalData.receiveAddress) {
      this.setData({
        receiveAddress: app.globalData.receiveAddress
      })
    } else {
      this.setData({
        receiveAddress: {
          uname: '添加收件人信息',
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
  createOrder: function () {
    let _this = this;
    if (!_this.data.sendAddress.pro_city || !_this.data.receiveAddress.pro_city || !_this.data.order.goodsname || !_this.data.order.goodsnum || _this.data.popListItemIndex == -1) {
      wx.showToast({
        title: '信息填写不完整',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    let param = {
      company_code: _this.data.order.companycode,
      id: _this.data.userInfo.id,
      shop_name: _this.data.order.shopname,
      company_lat: _this.data.lat,
      company_lng: _this.data.lng,
      goodsname: _this.data.order.goodsname,
      goodsnum: _this.data.order.goodsnum,
      billinfo: _this.data.order.billinfo,
      rec_name: _this.data.receiveAddress.uname,
      rec_tel: _this.data.receiveAddress.tel,
      rec_procity: _this.data.receiveAddress.pro_city,
      rec_detailarea: _this.data.receiveAddress.detail_addr,
      price: _this.data.order.price
    }
    util.wxResquest({
      url: '/transport/api/createcompanybill',
      method: 'POST',
      data: param
    }, function (res) {
      if (res.data.success) {
        wx.showToast({
          title: '下单成功',
          duration: 2000
        });
        setTimeout(function () {
          wx.hideToast();
          wx.navigateBack({
            delta: '1'
          })
        }, 2000)
      }

    })
  },
  getAddressList: function () {
    let _this = this;
    util.wxResquest({
      url: '/transport/api/searchaddr',
      method: 'GET',
      data: {
        addrrole: 0
      }
    }, function (res) {
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
  //获取物流公司名称
  getCompanyInfo: function () {
    let _this = this;
    util.wxResquest({
      url: '/transport/api/searchcompany',
      method: 'POST',
      data: ''
    }, function (res) {
      let data = res.data.data;
      console.log(data);
      _this.setData({
        company_id: data.companyId,
        'sendAddress.sender_name': data.companyName,
        'sendAddress.tel': data.serviceTel,
        'sendAddress.pro_city': data.companyProcity,
        'sendAddress.detail_addr': data.companyDetailarea
      });
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
    if (flag == 'receive') { //填写收件地址，不保存在地址列表中
      wx.navigateTo({
        url: '../address/address?id=add&flag=receive',
      })
    } else {
      app.globalData.address = _this.data.sendAddress;
      wx.navigateTo({
        url: '../address/address?id=' + _this.data.sendAddress.id,
      })
    }
  },
  bindGoodsInput: function (e) {
    this.setData({
      'order.goodsname': e.detail.value
    });
  },
  bindNumInput: function (e) {
    this.setData({
      'order.goodsnum': e.detail.value
    });
  },
  bindShopNameInput: function (e) {
    this.setData({
      'order.shopname': e.detail.value
    });
  },
  bindPriceInput: function (e) {
    this.setData({
      'order.price': e.detail.value
    });
  },
  bindCompanyCodeInput: function (e) {
    this.setData({
      'order.companycode': e.detail.value
    });
  },
  bindInfoInput: function (e) {
    this.setData({
      'order.billinfo': e.detail.value
    });
  }
})