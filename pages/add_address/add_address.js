// pages/add_address/add_address.js
const app = getApp();
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[1,2,2,3],
    fromOrder:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.flag == 'receive'){
      this.setData({
        fromOrder: 'receive'
      })
    } else if (options.flag == 'send'){
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
  //返回下单页面
  backOrder: function(e){
    const index = e.currentTarget.dataset.id;
    if(this.data.fromOrder == 'receive'){ //从下单的收件人地址簿过来的
      app.globalData.receiveAddress = this.data.list[index];
    } else if(this.data.fromOrder == 'send'){
      app.globalData.address = this.data.list[index];
    }
    wx.navigateBack({
      delta: '1'
    })
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
  setDefaultAddre: function(e){
    const index = e.currentTarget.dataset.index;
    const listData = this.data.list[index];
    let _this = this;
    if(listData.isdefault == 1){
      return;
    }
    util.wxResquest({
      url: '/transport/api/updateaddr',
      data: {
        'id': listData.id,
        'uname': listData.uname,
        'tel': listData.tel,
        'pro_city': listData.pro_city,
        'detail_addr': listData.detail_addr,
        'isdefault': 1
      },
      method: 'POST',
    }, function (res) {
      let newList = [];
      for(let item of _this.data.list){
        item.isdefault = 0;
        newList.push(item);
      }
      newList[index].isdefault = 1;
      _this.setData({
        list: newList
      })
    })
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