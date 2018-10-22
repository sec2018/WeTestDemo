var utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    shopData:{
      shopname: '',
      shoptel: '',
      shopprocity: '',
      shopdetail: ''
    },
    companydata:{
      companyname:'',
      companytel:'',
      companyprocity:'',
      companydetail:''
    }
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
    this.searchShop();
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
  searchShop: function (){
    let _this = this;
    utils.wxResquest({
      url: '/transport/api/searchshop',
      method: 'POST'
    }, function (res) {
      if (res.data.success) {
        wx.showToast({
          title: res.data.msg,
          duration: 2000
        });
        console.log(res.data.data);
        let resdata = res.data.data;
        _this.setData({
          shopData:{
            shopname: resdata.shopName,
            shoptel: resdata.shopTel,
            shopprocity: resdata.shopProcity,
            shopdetail: resdata.shopDetailarea
          }
        })
      }
    })
  },
})