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
    closeDialog: true,
    orderList:[]
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
    this.getOrderList();
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
    wx.setStorageSync('mulit_orderdetail', '');   
    this.setData({
      closeDialog: false
    });
  },
  closeDialogHandle() {
    wx.setStorageSync('mulit_orderdetail', ''); 
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
    data.batch_code = "1";
    //加上寄件人地址
    let param = Object.assign({}, data, {
      sender_name: _this.data.sendAddress.uname,
      sender_procity: _this.data.sendAddress.pro_city,
      sender_detailarea: _this.data.sendAddress.detail_addr,
      sender_tel: _this.data.sendAddress.tel,
    })
    if(param.id){//修改事件
      //调用保存按钮，保存成功后，将closeDialog设置为true
      
      util.wxResquest({
        url: '/transport/api/senderupdatebill',
        method: 'POST',
        data: param
      }, function (res) {
        if (res.data.success) {
          wx.showToast({
            title: '保存成功',
            duration: 2000
          });
          _this.setData({
            closeDialog: true
          });
          _this.getOrderList();
        }

      })
    } else {
      //调用保存按钮，保存成功后，将closeDialog设置为true
      util.wxResquest({
        url: '/transport/api/createbill',
        method: 'POST',
        data: param
      }, function (res) {
        if (res.data.success) {
          wx.showToast({
            title: '保存成功',
            duration: 2000
          });
          _this.setData({
            closeDialog: true
          });
          _this.getOrderList();
        }

      })
    }
    
  },
  //获取订单列表
  getOrderList(){
    let _this = this;
    util.wxResquest({
      url: '/transport/api/getbatchbill',
      method: 'GET',
      data: ''
    }, function (res) {
      if (res.data.success) {
        _this.setData({
          orderList: res.data.data
        })
      }
    })
  },
  toDetailUrl(e){
    let index = e.currentTarget.dataset.index;
    wx.setStorageSync('mulit_orderdetail', JSON.stringify(this.data.orderList[index]));
    this.setData({
      closeDialog: false
    })
  },
  //删除事件
  deteleOrder(e){
    let index = e.currentTarget.dataset.index;
    let _id = this.data.orderList[index].id;
    console.log(_id);
    let _this = this;
    let dataParam = {
      'id': _id
    }
    util.wxResquest({
      url: '/transport/api/deletesenderbill',
      method: 'POST',
      data: dataParam
    }, function (res) {
      if (res.data.success) {
        //orderList设置为去除该条目剩下的部分
        // let _orderList = _this.data.orderList.splice(index, 1)
        wx.showToast({
          title: '删除成功',
          duration: 2000
        });
        _this.getOrderList();
      }
    })
  },
   //合并下单
  batchOrder(){
    let _this = this;
    util.wxResquest({
      url: '/transport/api/savebatchbills',
      method: 'POST',
      data: ''
    }, function (res) {
      if (res.data.success) {
        wx.showToast({
          title: '下单成功',
          duration: 2000
        });
        _this.setData({
          orderList: []
        })
      }
    })
  }
})