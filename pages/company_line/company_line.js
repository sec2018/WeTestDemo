// pages/company_line.js
const app = getApp()
const util = require('../../utils/util.js');
let companyId = '';
let updateIndex = -1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    defaultId:-1,
    companyId: -1,
    popshow: false,
    isAdd: true,
    company: {
      begin_addr: '',
      arrive_addr: '',
      arrive_tel: '',
      arrive_detail_addr: ''
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
    this.searchCompany();
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
  getAllLine(){
    let _this = this;

    wx.showLoading({
      title: '加载中',
    });
    util.wxResquest({
      url: '/transport/api/getcompanylines',
      method: 'GET',
      data: {
        company_id: companyId
      }
    }, function (res) {
      wx.hideLoading();
      let data = res.data.data;
      let dataL = data.length;
      let defaultId = 0;
      for(let i = 0; i<dataL; i++){
        if(companyId == data[i]){
          defaultId = i;
        }
      }
      _this.setData({
        list: data,
        defaultId: defaultId,
        companyId: companyId,
        popshow: false
      })
    })
  },
  searchCompany: function () {
    let _this = this;
    util.wxResquest({
      url: '/transport/api/searchcompany',
      method: 'POST'
    }, function (res) {
      if (res.data.success) {
        let resdata = res.data.data;
        companyId = resdata.companyId;
        _this.getAllLine();
      }
    })
  },
  bindBejinInput: function (e) {
    this.setData({
      'company.begin_addr': e.detail.value
    });
  },
  bindArriveInput: function (e) {
    this.setData({
      'company.arrive_addr': e.detail.value
    });
  },
  bindArriveTelInput: function (e) {
    this.setData({
      'company.arrive_tel': e.detail.value
    });
  },
  bindArriveDetailInput: function (e) {
    this.setData({
      'company.arrive_detail_addr': e.detail.value
    });
  },
  cancelShow(){
    this.setData({
      popshow: false
    })
  },
  openShow(e){
    const id = e.currentTarget.dataset.id;
    if(id == 'add'){
      this.setData({
        popshow: true,
        isAdd: true,
        company: {
          begin_addr: '',
          arrive_addr: '',
          arrive_tel: '',
          arrive_detail_addr: ''
        }
      })
    } else {
      updateIndex = id;
      let companyLin = this.data.list[updateIndex];
      this.setData({
        popshow: true,
        isAdd: false,
        company: {
          begin_addr: companyLin.beginAddr,
          arrive_addr: companyLin.arriveAddr,
          arrive_tel: companyLin.arriveTel,
          arrive_detail_addr: companyLin.arriveDetailAddr
        }
      })
    }
    
  },
  /**
   * 保存按钮
   */
  saveData(){
    let _this = this;
    let arr = [_this.data.company];
    let jsonStr = JSON.stringify(arr);
    let dataParam = {
      companyid: companyId,
      flag: _this.data.isAdd ? 0 : 1,
      lines_json: jsonStr,
    }
    if(!_this.data.isAdd){
      dataParam.line_id = _this.data.list[updateIndex].id
    }
    let lineid = _this.data.isAdd ? '' : 1;
    if (!_this.data.company.begin_addr
      || !_this.data.company.arrive_addr) {
      wx.showToast({
        title: '信息填写不完整',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.showLoading({
      title: '加载中',
    });
    util.wxResquest({
      url: '/transport/api/addorupdatecompanylines',
      method: 'GET',
      data: dataParam
    }, function (res) {
      wx.hideLoading();
      _this.getAllLine();
    })
  },
  deteleList(e){
    const _this = this;
    const index = e.currentTarget.dataset.id;
    let lineid = _this.data.list[index].id;
    wx.showModal({
      title: '提示',
      content: '确定删除？',
      success(res) {
        if (res.confirm) {
          _this.deteleAjax(lineid);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  deteleAjax(lineid){
    let _this = this;

    wx.showLoading({
      title: '加载中',
    });
    util.wxResquest({
      url: '/transport/api/deletecompanylines',
      method: 'GET',
      data: {
        line_id: lineid

      }
    }, function (res) {
      wx.hideLoading();
      wx.showToast({
        title: '删除成功',
        icon: 'none',
        duration: 2000
      })
      _this.getAllLine();
    })
  }
})