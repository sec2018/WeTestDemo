// pages/address/address.js
const app = getApp();
const util = require('../../utils/util.js');
let addrrole = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {
      username: '',
      address: '',
      phone: '',
      region: '请选择',
      isDefault: false,
    },
    receiveAdd: false,
    id: 'add',
    region: ['', '', ''],
    customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    addrrole = options.addrrole;
    if (options.id !='add') {
      wx.setNavigationBarTitle({
        title: '修改我的地址'
      });
      this.setData({
        'address.username': app.globalData.address.uname,
        'address.address': app.globalData.address.detail_addr,
        'address.phone': app.globalData.address.tel,
        'address.region': app.globalData.address.pro_city,
        'address.isDefault': app.globalData.address.isdefault == 1 ? true : false,
        region: app.globalData.address.pro_city.split(' '),
        id: options.id
      });
    } else if (options.flag == 'receive'){
      wx.setNavigationBarTitle({
        title: '收件人地址填写'
      });
      if (app.globalData.receiveAddress){
        this.setData({
          'address.username': app.globalData.receiveAddress.uname,
          'address.address': app.globalData.receiveAddress.detail_addr,
          'address.phone': app.globalData.receiveAddress.tel,
          'address.region': app.globalData.receiveAddress.pro_city,
          region: app.globalData.receiveAddress.pro_city.split(' '),
          receiveAdd: true
        });
      } else {
        this.setData({
          receiveAdd: true
        })
      }

    } else {
      wx.setNavigationBarTitle({
        title: '新增收货地址'
      });
      
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
  switchChange: function(e){
    const result = e.detail.value;
    this.setData({
      'address.isDefault': result
    });
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const result = e.detail.value;
    this.setData({
      region: result,
      'address.region': result[0]+' '+result[1] + ' ' + result[2]
    })
  },
  onClickLocation: function () {
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        let regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;
        let REGION_PROVINCE = [];
        let addressBean = {
          REGION_PROVINCE: null,
          REGION_COUNTRY: null,
          REGION_CITY: null,
          ADDRESS: null
        };
        function regexAddressBean(address, addressBean) {
          regex = /^(.*?[市州]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g;
          let addxress = regex.exec(address);
          addressBean.REGION_CITY = addxress[1];
          addressBean.REGION_COUNTRY = addxress[2];
          addressBean.ADDRESS = addxress[3] + "(" + res.name + ")";
          console.log(addxress);
        }
        if (!(REGION_PROVINCE = regex.exec(res.address))) {
          regex = /^(.*?(省|自治区))(.*?)$/;
          REGION_PROVINCE = regex.exec(res.address);
          addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
          regexAddressBean(REGION_PROVINCE[3], addressBean);
        } else {
          addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
          regexAddressBean(res.address, addressBean);
        }
        console.log(addressBean)
        that.setData({
          region: [addressBean.REGION_PROVINCE, addressBean.REGION_CITY, addressBean.REGION_COUNTRY],
          'address.address': addressBean.ADDRESS,
          'address.region': addressBean.REGION_PROVINCE + ' ' + addressBean.REGION_CITY + ' ' +addressBean.REGION_COUNTRY
        });
      }
    })
  },
  onSave: function () {
    const _this = this;
    if (!_this.data.address.address 
      || !_this.data.address.username 
      || !_this.data.address.phone
      || _this.data.address.region == '请选择'){
      wx.showToast({
        title: '信息填写不完整',
        icon: 'none',
        duration: 2000
      });
      return;
      }
    if(_this.data.id != 'add') {
      util.wxResquest({
        url: '/transport/api/updateaddr',
        data: {
          'id': _this.data.id,
          'uname': _this.data.address.username,
          'tel': _this.data.address.phone,
          'pro_city': _this.data.address.region,
          'detail_addr': _this.data.address.address,
          'isdefault': _this.data.address.isDefault ? 1 : 0
        },
        method: 'POST',
      }, function (res) {
        app.globalData.address = {
          'id': _this.data.id,
          'uname': _this.data.address.username,
          'tel': _this.data.address.phone,
          'pro_city': _this.data.address.region,
          'detail_addr': _this.data.address.address,
          'isdefault': _this.data.address.isDefault ? 1 : 0
        }
        wx.navigateBack({
          delta: 1
        })
      })
    } else if (_this.data.receiveAdd){ //收件地址不保存在列表中
      app.globalData.receiveAddress = {
        'uname': _this.data.address.username,
        'tel': _this.data.address.phone,
        'pro_city': _this.data.address.region,
        'detail_addr': _this.data.address.address
      };
      wx.navigateBack({
        delta: 1
      })
    } else {
      util.wxResquest({
        url: '/transport/api/addaddr',
        data: {
          'uname': _this.data.address.username,
          'tel': _this.data.address.phone,
          'pro_city': _this.data.address.region,
          'detail_addr': _this.data.address.address,
          'addrrole': addrrole,
          'isdefault': _this.data.address.isDefault ? 1 : 0
        },
        method: 'POST',
      }, function (res) {
        wx.navigateBack({
          delta: 1
        })
      })
    }
    
  },
  bindClear: function(e){
    console.log(e.target.id)
    const typ = e.target.id;
    if (typ == 'phone-clear') {
      this.setData({
        'address.phone': ''
      });
    }
    if (typ == 'username-clear') {
      this.setData({
        'address.username': ''
      });
    }
    if (typ == 'address-clear') {
      this.setData({
        'address.address': ''
      });
    }
  },
  bindNameInput: function(e){
    this.setData({
      'address.username': e.detail.value
    });
  },
  bindTelInput: function (e) {
    this.setData({
      'address.phone': e.detail.value
    });
  },
  bindAddressInput: function (e) {
    this.setData({
      'address.address': e.detail.value
    });
  }
})