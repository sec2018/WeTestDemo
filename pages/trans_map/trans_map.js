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
    isWxChatHid: true,
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
  onShow(){
    let _this =this;
    mapIndex.setPageStyle(function(res){
      _this.setData(res)
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})

