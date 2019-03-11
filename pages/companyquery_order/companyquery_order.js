// pages/query_order/query_order.js

const app = getApp();
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchrecname: '',
    list: [],
    tabIndex: 1,
    pageIndex: 1,
    pageSize: 4,
    total: 0,
    initData: true
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
    let _this = this;
    this.setData({
      list: [],
      total: 0,
      pageIndex: 1,
      initData: true
    }, function () {
      _this.getData();
    });

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
  recinput: function (e) {
    let value = e.detail.value.replace(/\s+/g, '');
    this.setData({
      searchrecname: value
    })
  },
  goToDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    console.log(e)
    let data = this.data.list[id];
    wx.setStorageSync('companyOrderDetail', data);
    wx.navigateTo({
      url: '../companyorder_detail/companyorder_detail',
    })
  },
  tabClick: function (e) {
    let id = e.currentTarget.dataset.id;
    let _this = this;
    this.setData({
      tabIndex: id,
      list: [],
      total: 0,
      pageIndex: 1,
      initData: true
    }, function () {
      _this.getData();
    });

  },
  getData: function () {
    let _this = this;
    if (!_this.data.initData && _this.data.list.length == _this.data.total) {
      return;
    }
    if (!this.data.searchrecname) {
      this.getBillList();
    } else {
      this.getQueryBillList();
    }
  },
  clickQueryBtn: function () {
    let _this = this;
    this.setData({
      list: [],
      total: 0,
      pageIndex: 1,
      initData: true
    }, function () {
      _this.getData();
    });
  },
  //获取订单列表
  getBillList: function () {
    let _this = this;

    wx.showLoading({
      title: '加载中',
    });
    util.wxResquest({
      url: '/transport/api/getcompanytabbill',
      method: 'GET',
      data: {
        startitem: _this.data.pageIndex,
        pagesize: _this.data.pageSize,
        isfinishflag: _this.data.tabIndex == 1 ? 0 : 1
      }
    }, function (res) {
      wx.hideLoading();
      let data = res.data.data;
      let pageIndex = _this.data.pageIndex + 1;
      let listData = _this.data.list;
      let dataLen = data.data.length;
      for (let i = 0; i < dataLen; i++) {
        listData.push(data.data[i]);
      }
      _this.setData({
        list: listData,
        total: data.totalNum,
        pageIndex: pageIndex,
        initData: false
      });
    })
  },
  //根据查询条件获取列表
  getQueryBillList: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    });
    util.wxResquest({
      url: '/transport/api/getcompanybillbynameortel',  
      method: 'GET',
      data: {
        startitem: _this.data.pageIndex,
        pagesize: _this.data.pageSize,
        isfinishflag: _this.data.tabIndex == 1 ? 0 : 1,
        sender_param: _this.data.searchrecname
      }
    }, function (res) {
      wx.hideLoading();
      let data = res.data.data;
      let pageIndex = _this.data.pageIndex + 1;
      let listData = _this.data.list;
      let dataLen = data.data.length;
      for (let i = 0; i < dataLen; i++) {
        listData.push(data.data[i]);
      }
      _this.setData({
        list: listData,
        total: data.totalNum,
        pageIndex: pageIndex,
        initData: false
      });
    })
  },
  getUnfinishedList: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    });
    util.wxResquest({
      url: '/transport/api/getcompanyunfinishbill',
      method: 'GET',
      data: ""
    }, function (res) {
      wx.hideLoading();
      let data = res.data.data; 
      _this.setData({
        list: data
      });
    })
  },
  getFinishedList: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    });
    util.wxResquest({
      url: '/transport/api/getcompanyfinishedbill',
      method: 'GET',
      data: ""
    }, function (res) {
      wx.hideLoading();
      let data = res.data.data;
      _this.setData({
        list: data
      });
    })
  },
  searchByrecname: function (e) {
    let _this = this;
    let _searchrecname = _this.data.searchrecname;
    console.log(_searchrecname);
    let reslist = [];
    let dataLen = _this.data.list.length;
    for (let i = 0; i < dataLen; i++) {
      if (_this.data.list[i].rec_name.indexOf(_searchrecname) != -1) {
        reslist.push(_this.data.list[i]);
      }
    }
    console.log(reslist);
    _this.setData({
      list: reslist
    });
  },
  getListMore() {
    console.log('more');
    this.getData();
  }
})
