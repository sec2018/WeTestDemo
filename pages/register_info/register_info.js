// pages/address/address.js
const app = getApp();
const util = require('../../utils/util.js');
let option = {};
let defaultLineId = -1;
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
    imageurl: '../../images/image_add.jpg',
    imageurlFront: '../../images/image_add.jpg',
    imageurlBlank: '../../images/image_add.jpg',
    roleid: '2',
    flag: 'add',
    region: ['', '', ''],
    customItem: '全部',
    tran:{
      frontUrl:'',
      blankUrl:''
    },
    company: {
      licence_url: '',
      complain_tel: '',
      service_tel: '',
      begin_addr: '',
      arrive_addr: '',
      arrive_tel: '',
      arrive_detail_addr:''
    }
  },
  onLoad:function(options){
    option = options;
    
  },
 
  onShow: function () {
    
    if (option.flag == 'update'){
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
      } else if (roleid == '3') { //承运员
        wx.setNavigationBarTitle({
          title: '承运员信息'
        });
        this.searchTran();
      } else if (roleid == '4') { //物流公司
        wx.setNavigationBarTitle({
          title: '物流公司信息'
        });
        this.searchCompany();
      }
      
      
    } else if (option.id == '2') { //商家
      wx.setNavigationBarTitle({
        title: '商家信息填写'
      });
      this.setData({
        roleid: '2',
        flag: 'add'
      });
    } else if (option.id == '3') { //承运员
      wx.setNavigationBarTitle({
        title: '承运员信息填写'
      });
      this.setData({
        roleid: '3',
        flag: 'add'
      })
    } else if (option.id == '4') { //物流公司
      wx.setNavigationBarTitle({
        title: '物流公司信息填写'
      });
      this.setData({
        roleid: '4',
        flag: 'add'
      })
    }
    
  },
  onSave: function(){
    const _this = this;
    if(_this.data.roleid == '3'){ //承运员信息
      if (!_this.data.address.username
        || !_this.data.address.phone) {
        wx.showToast({
          title: '信息填写不完整',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (_this.data.imageurlFront == '../../images/image_add.jpg') {
        wx.showToast({
          title: '请上传身份证正面',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (_this.data.imageurlBlank == '../../images/image_add.jpg') {
        wx.showToast({
          title: '请上传身份证反面',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (_this.data.imageurlFront == (app.globalData.apiRoot + '/transport' + _this.data.company.licence_url) && _this.data.imageurlBlank == (app.globalData.apiRoot + '/transport' + _this.data.company.licence_url)) {
        _this.tranAjax();
        return;
      }
      _this.uploadImage(_this.data.imageurlFront, _this.data.roleid, 'front');
    } else if (!_this.data.address.address
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
      if (!_this.data.company.complain_tel
        || !_this.data.company.service_tel
        || !_this.data.company.begin_addr
        || !_this.data.company.arrive_addr
        || !_this.data.company.arrive_detail_addr
        || !_this.data.company.arrive_tel) {
        wx.showToast({
          title: '信息填写不完整',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (_this.data.imageurl == '../../images/image_add.jpg') {
        wx.showToast({
          title: '请上传营业执照',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (_this.data.imageurl == (app.globalData.apiRoot + '/transport' + _this.data.company.licence_url)){
        _this.companyAjax();
        return;
      }
      _this.uploadImage(_this.data.imageurl, _this.data.roleid,'');
    }
    
  },
  uploadImage: function(param, roleid, itype){ //上传图片
    let _this = this;
    wx.uploadFile({
      url: app.globalData.apiRoot + '/transport/api/uploadimage',
      filePath: param,
      name: 'imagefile',
      header: {
        token: wx.getStorageSync('token'),
        roleid: wx.getStorageSync('roleid')
      },
      success(res) {
        const data = res.data;
        console.log(JSON.parse(data))
        // do something
        if(roleid == '3'){ //承运员
          if(itype == 'front'){
            _this.uploadImage(_this.data.imageurlBlank, _this.data.roleid, '');
            _this.setData({
              'company.licence_url': JSON.parse(data).data
            });
          } else { //身份证反面
            _this.setData({
              'company.licence_url': JSON.parse(data).data
            })
            _this.tranAjax()
          }
        } else if(roleid == '4'){ //物流公司
          _this.setData({
            'company.licence_url': JSON.parse(data).data
          })
          _this.companyAjax()
        }
        
      }
    })
  },
  companyAjax: function(){
    let dataParam = {
      companyname: this.data.address.username,
      company_tel: this.data.address.phone,
      company_procity: this.data.address.region,
      company_detailarea: this.data.address.address,
      licence_url: this.data.company.licence_url,
      evaluation: 5,
      complain_tel: this.data.company.complain_tel,
      service_tel: this.data.company.service_tel,
      begin_addr: this.data.company.begin_addr,
      arrive_addr: this.data.company.arrive_addr,
      arrive_detail_addr: this.data.company.arrive_detail_addr,
      arrive_tel: this.data.company.arrive_tel

    };
    if (this.data.flag == 'update') {
      dataParam.companyid = this.data.address.id;
      dataParam.line_id = defaultLineId;
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
  tranAjax: function(){ //保存承运员信息接口
    let dataParam = {
      tranname: this.data.address.username,
      trantel: this.data.address.phone,
      frontUrl: this.data.imageurlFront,
      blankUrl: this.data.imageurlBlank

    };
    if (this.data.flag == 'update') {
      dataParam.tranid = this.data.address.id;
    }
    let roleid = this.data.roleid;
    //发起网络请求
    util.wxResquest({
      url: '/transport/api/addorupdatetran',
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
        defaultLineId = resdata.defaultLineid;
        _this.getDefaultLineId();
        _this.setData({
          address: {
            id: resdata.companyId,
            username: resdata.companyName,
            phone: resdata.companyTel,
            region: resdata.companyProcity,
            address: resdata.companyDetailarea
          },
          imageurl: app.globalData.apiRoot +'/transport'+resdata.licenceUrl,
          company: {
            licence_url: resdata.licenceUrl,
            complain_tel: resdata.complainTel,
            service_tel: resdata.serviceTel,
            begin_addr: '',
            arrive_addr: '',
            arrive_tel: '',
            arrive_detail_addr: ''
          }
        })
      }
    })
  },
  searchTran: function () { // 承运员信息
    let _this = this;
    util.wxResquest({
      url: '/transport/api/searchtran',
      method: 'POST'
    }, function (res) {
      if (res.data.success) {
        let resdata = res.data.data;
        _this.setData({
          address: {
            id: resdata.tranId,
            username: resdata.tranName,
            phone: resdata.tranTel
          },
          tran:{
            frontUrl: resdata.frontUrl,
            blankUrl: resdata.blankUrl
          },
          imageurlFront: app.globalData.apiRoot + '/transport' + resdata.frontUrl,
          imageurlBlank: app.globalData.apiRoot + '/transport' + resdata.blankUrl
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
    if (typ == 'complain_tel_clear'){
      this.setData({
        'company.complain_tel': ''
      })
    }
    if (typ == 'service_tel_clear') {
      this.setData({
        'company.service_tel': ''
      })
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
  },
  bindComplainInput: function (e) {
    this.setData({
      'company.complain_tel': e.detail.value
    });
  },
  bindServiceInput: function (e) {
    this.setData({
      'company.service_tel': e.detail.value
    });
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
  chooseimg: function(){
    let _this =this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        _this.setData({
          imageurl: tempFilePaths[0]
        })
        
      }
    })
  },
  chooseCodeFront: function () { //身份证正面
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        _this.setData({
          imageurlFront: tempFilePaths[0]
        })

      }
    })
  },
  chooseCodeBlank: function () { //身份证反面
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        _this.setData({
          imageurlBlank: tempFilePaths[0]
        })

      }
    })
  },
  getDefaultLineId: function () {
    let _this = this;
    util.wxResquest({
      url: '/transport/api/getcompanylinesbyid',
      method: 'GET',
      data: {
        line_id: defaultLineId
      }
    }, function (res) {
      let data = res.data.data;
      _this.setData({
        'company.begin_addr': data.beginAddr,
        'company.arrive_addr': data.arriveAddr,
        'company.arrive_tel': data.arriveTel,
        'company.arrive_detail_addr': data.arriveDetailAddr
      });
    })
  }
})