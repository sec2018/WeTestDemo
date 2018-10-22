// pages/address/address.js
const app = getApp();
const util = require('../../utils/util.js')
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
    },
    roleid: '2',
    flag: 'add',
    region: ['', '', ''],
    customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.flag == 'update'){
      let roleid = wx.getStorageSync('roleid');
      this.setData({
        roleid: roleid,
        flag: 'update'
      });
      if (roleid == '2') { //商家
        wx.setNavigationBarTitle({
          title: '商家信息'
        });
        this.searchShop();
      } else if (roleid == '4') { //物流公司
        wx.setNavigationBarTitle({
          title: '物流公司信息'
        });
        this.searchCompany();
      }
      
      
    }else if (options.id == '2') { //商家
      wx.setNavigationBarTitle({
        title: '商家信息填写'
      });
      this.setData({
        roleid:'2',
        flag: 'add'
      });
    } else if (options.id == '4'){ //物流公司
      wx.setNavigationBarTitle({
        title: '物流公司信息填写'
      });
      this.setData({
        roleid: '4',
        flag: 'add'
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
  onSave: function(){
    const _this = this;
    if (!_this.data.address.address
      || !_this.data.address.username
      || !_this.data.address.phone
      || _this.data.address.region == '请选择') {
      wx.showToast({
        title: '信息填写不完整',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (this.data.roleid == 2) {
      this.shopAjax()
    } else if (this.data.roleid == 4) {
      this.companyAjax()
    }
    
  },
  companyAjax: function(){
    let dataParam = {
      companyname: this.data.address.username,
      company_tel: this.data.address.phone,
      company_procity: this.data.address.region,
      company_detailarea: this.data.address.address
    };
    if (this.data.flag == 'update') {
      dataParam.companyid = this.data.address.id
    }
    let roleid = this.data.roleid;
    //发起网络请求
    util.wxResquest({
      url: '/transport/api/addorupdatecompany',
      data: dataParam,
      method: 'POST',
      header: {
        'roleid': roleid
      }
    }, function (res) {
      if(res.data.code == 200){
        
        wx.setStorageSync('roleid', roleid);
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        setTimeout(function () {
          wx.reLaunch({
            url: '../index/index',
          })
        }, 1500)
      }
    })
  },
  shopAjax: function(){
    let dataParam = {
      shopname: this.data.address.username,
      shop_tel: this.data.address.phone,
      shop_procity: this.data.address.region,
      shop_detailarea: this.data.address.address
    };
    if (this.data.flag == 'update'){
      dataParam.shopid = this.data.address.id
    }
    let roleid = this.data.roleid;
    //发起网络请求
    util.wxResquest({
      url: '/transport/api/addorupdateshop',
      data: dataParam,
      method: 'POST',
      header: {
        'roleid': roleid
      }
    }, function (res) {
      if (res.data.code == 200) {
        wx.setStorageSync('roleid', roleid);
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
        setTimeout(function(){
          wx.reLaunch({
            url: '../index/index',
          })
        },1500)
      }
    })
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
  searchShop: function () {
    let _this = this;
    util.wxResquest({
      url: '/transport/api/searchshop',
      method: 'POST'
    }, function (res) {
      if (res.data.success) {
        let resdata = res.data.data;
        _this.setData({
          address: {
            id:resdata.shopId,
            username: resdata.shopName,
            phone: resdata.shopTel,
            region: resdata.shopProcity,
            address: resdata.shopDetailarea
          }
        })
      }
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
        _this.setData({
          address: {
            id: resdata.companyId,
            username: resdata.companyName,
            phone: resdata.companyTel,
            region: resdata.companyProcity,
            address: resdata.companyDetailarea
          }
        })
      }
    })
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