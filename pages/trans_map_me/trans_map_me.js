// pages/trans_map/trans_map.js
var mapIndex = require('../../utils/map-index.js');
var utils = require('../../utils/util.js');
//获取应用实例
const app = getApp();
var mapShowGlo = false;
/**
 * data参数说明
 */
Page({
  data: {
    longitude: '',
    latitude: '',
    scale: 17,
    markers: [{
      iconPath: "../../images/user.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '../../images/user.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  onReady(){
    let _this = this;
    mapIndex.setPageStyle(function (res) {
      _this.setData(res)
    });
  },
  onShow(){
    let _this =this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res){
        _this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        })
        _this.getMarkerList();
      }
    });
    // _this.getMarkerList();
  },
  regionchange(e) {
    console.log(e.type);
  },
  markertap(e) {
    let index = e.markerId;
    let data = this.data.markers[index];
    let id = data.indexId;
    data.id = id;
    if (data.customordertype == '商户') {
      wx.setStorageSync('orderDetail', data);
      wx.navigateTo({
        url: '../order_detail/order_detail',
      })
    } else {
      wx.setStorageSync('companyorderDetail', data);
      wx.navigateTo({
        url: '../companyorder_detail/companyorder_detail',
      })
    }
  },
  controltap(e) {
    console.log(e.controlId)
    const id = e.controlId;
    if (id == 2) {
      wx.switchTab({
        url: '../usercenter/usercenter'
      })
    }
    if(id==1){
      let _this = this;
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          _this.setData({
            longitude: res.longitude,
            latitude: res.latitude,
          })
          _this.getMarkerList();
        }
      });
      // _this.getMarkerList();
    }
  },
  getMarkerList: function(){
    let _this =this;
    let param = {
      startitem: 1,
      pagesize: 1000,
      isfinishflag: 0
    }
    utils.wxResquest({
      url: '/transport/api/getusertabbill',
      data: param,
      method: 'GET'
    }, function (result) {
      let data = result.data.data.data;
      let dataLen = data.length;
      for(let i=0; i<dataLen; i++){
        console.log(data[i])
        data[i].latitude = data[i].sender_lat;
        data[i].iconPath = '../../images/bill.png';
        data[i].longitude = data[i].sender_lng;
        data[i].width = 35;
        data[i].height = 40;
        data[i].indexId = data[i].id;
        data[i].id = i;
        data[i].customordertype = '商户';
      }
      console.log(data)
      _this.setData({
        markers:data
      })
      _this.getCompanyList();
    })
  },
  getCompanyList:function(){
    let _this = this;
    let param = {
      startitem: 1,
      pagesize: 1000,
      isfinishflag: 0
    }
    utils.wxResquest({
      url: '/transport//api/getcompanytabbill',
      data: param,
      method: 'GET'
    }, function (result) {
      let data = result.data.data.data;
      let dataLen = data.length;
      let arr = _this.data.markers;
      let lastIndex = _this.data.markers.length;
      for (let i = 0; i < dataLen; i++) {
        data[i].latitude = data[i].company_lat;
        data[i].iconPath = '../../images/billcompany.png';
        data[i].longitude = data[i].company_lng;
        data[i].width = 35;
        data[i].height = 40;
        data[i].indexId = data[i].id;
        data[i].id = i + lastIndex;
        data[i].customordertype = '公司';
        arr.push(data[i]);
      }
      _this.setData({
        markers: arr
      })
    })
  }
})

