// pages/query_order/query_order.js

const app = getApp();
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchrecname:'',
    list: [1, 2, 2, 3],
    fromOrder: false,
    tabIndex:1
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
  recinput:function(e){
    let value = e.detail.value.replace(/\s+/g,'');
    this.setData({
      searchrecname: value
    })
  },
  goToDetail:function(e){
    let id = e.currentTarget.dataset.id;
    console.log(e)
    let data = this.data.list[id];
    wx.setStorageSync('orderDetail', data);
    wx.navigateTo({
      url: '../order_detail/order_detail',
    })
  },
  tabClick: function(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      tabIndex: id
    });
    if(id==1){
      this.getUnfinishedList();
    } else {
      this.getFinishedList();
    }
  },
  getUnfinishedList: function () {
    let _this = this;

    util.wxResquest({
      url: '/transport/api/getuserunfinishbill',
      method: 'GET',
      data: ""
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
      data: ""
    }, function (res) {
      let data = res.data.data;
      _this.setData({
        list: data
      });
    })
  },
  searchByrecname:function(e){
    let _this = this;
    let _searchrecname = _this.data.searchrecname;
    console.log(_searchrecname);
    let reslist = [];
    let dataLen = _this.data.list.length;
    for (let i = 0; i < dataLen; i++) {
      if (_this.data.list[i].rec_name.indexOf(_searchrecname)!=-1){
        reslist.push(_this.data.list[i]);
      }
    }
    console.log(reslist);
    _this.setData({
      list: reslist
    });
  }
})
