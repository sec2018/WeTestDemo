// components/custom_order/custom_order.js
const app = getApp();
const util = require('../../utils/util.js');
let shopData = {};
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propDialog:{
      type: Boolean,
      value: '',
      observer: function(val){
        if(val){ //弹窗被关闭

        } else { //弹窗被打开
          let orderDetail = wx.getStorageSync('mulit_orderdetail'); 
          console.log(orderDetail)
          if (orderDetail){
            orderDetail = JSON.parse(orderDetail);
            let company_id = orderDetail.company_id;
            let company_index = 0;
            for(let i=0; i<this.data.logisticsList.length; i++){
              if (this.data.logisticsList[i].companyId == company_id){
                company_index = i;
                break;
              }
            }
            
            this.setData({
              order: {
                id: orderDetail.id,
                company_code: orderDetail.company_code,
                goodsname: orderDetail.goodsname,
                goodsnum: orderDetail.goodsnum,
                billinfo: orderDetail.billinfo,
                price: orderDetail.price
              },
              receiveAddress: {
                uname: orderDetail.rec_name,
                tel: orderDetail.rec_tel,
                pro_city: orderDetail.rec_procity,
                detail_addr: orderDetail.rec_detailarea
              },
              shopname: orderDetail.shop_name,
              shopid: orderDetail.shop_id,
              logisticsIndex: company_index
            })
            console.log(this.data.logisticsIndex, '    ' + company_index, company_id)
          } else {
            this.setData({
              order: {
                company_code: '',
                goodsname: '',
                goodsnum: '',
                billinfo: '',
                price: 0
              },
              receiveAddress: {
                uname: '',
                tel: '',
                pro_city: '',
                detail_addr: ''
              },
              shopname: shopData.shopName,
              shopid: shopData.shopId
            })
          }
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    shopname: '',
    shopid: 0,
    logisticsList: ['顺丰', '申通', '圆通'],
    logisticsIndex: 0,
    popShow: false,
    popList: [],
    popListItem: [],
    popListIndex: -1,
    popListIndexLin: -1,
    popListItemIndexLin: -1,
    popListItemIndex: -1,
    order: {
      company_code: '',
      goodsname: '',
      goodsnum: '',
      billinfo: '',
      price: 0
    },
    receiveAddress: {
      uname: '',
      tel: '',
      pro_city: '',
      detail_addr: ''
    },
    sendAddress: {
      sender_name: '添加寄件人信息',
      tel: '',
      pro_city: '',
      detail_addr: ''
    },
    lng: '',
    lat: ''
  },
  pageLifetimes:{
    show: function () {
      console.log(app.globalData.receiveAddress)
      if (app.globalData.receiveAddress) {
        this.setData({
          receiveAddress: app.globalData.receiveAddress
        })
      } else {
        this.setData({
          receiveAddress: {
            uname: '添加收件人信息',
            tel: '',
            pro_city: '',
            detail_addr: ''
          }
        })
      }

    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //保存接口
    saveOrder: function(){
      let _this = this;
      let logistics = _this.data.logisticsList[_this.data.logisticsIndex];
      let param = {
        company_code: '',
        goodsname: _this.data.order.goodsname,
        goodsnum: _this.data.order.goodsnum,
        shop_id: _this.data.shopid,
        shop_name: _this.data.shopname,
        company_id: logistics.companyId,
        company_name: logistics.companyName,
        batch_code: '0',
        lat: _this.data.lat,
        lng: _this.data.lng,
        billinfo: _this.data.order.billinfo,
        rec_name: _this.data.receiveAddress.uname,
        rec_tel: _this.data.receiveAddress.tel,
        rec_procity: _this.data.receiveAddress.pro_city,
        rec_detailarea: _this.data.receiveAddress.detail_addr,
        price: _this.data.order.price
      }
      if(_this.data.order.id){
        param.id = _this.data.order.id;
      }
      this.triggerEvent('saveOrderHandle', param)
    },
    //下单接口
    createOrder: function () {
      let _this = this;
      let logistics = _this.data.logisticsList[_this.data.logisticsIndex];
      let param = {
        sender_name: _this.data.sendAddress.uname,
        company_code: _this.data.order.company_code,
        goodsname: _this.data.order.goodsname,
        goodsnum: _this.data.order.goodsnum,
        sender_tel: _this.data.sendAddress.tel,
        shop_id: _this.data.shopid,
        shop_name: _this.data.shopname,
        company_id: logistics.companyId,
        company_name: logistics.companyName,
        batch_code: '0',
        lat: _this.data.lat,
        lng: _this.data.lng,
        billinfo: _this.data.order.billinfo,
        sender_procity: _this.data.sendAddress.pro_city,
        sender_detailarea: _this.data.sendAddress.detail_addr,
        rec_name: _this.data.receiveAddress.uname,
        rec_tel: _this.data.receiveAddress.tel,
        rec_procity: _this.data.receiveAddress.pro_city,
        rec_detailarea: _this.data.receiveAddress.detail_addr,
        price: _this.data.order.price
      }
      util.wxResquest({
        url: '/transport/api/createbill',
        method: 'POST',
        data: param
      }, function (res) {
        if (res.data.success) {
          wx.showToast({
            title: '下单成功',
            duration: 2000
          });
          setTimeout(function () {
            wx.hideToast();
            wx.navigateBack({
              delta: '1'
            })
          }, 2000)
        }

      })
    },
    //获取物流公司列表
    getLogisticsList: function () {
      let _this = this;
      util.wxResquest({
        url: '/transport/api/getalllines',
        method: 'GET',
        data: ''
      }, function (res) {
        let data = res.data.data;
        console.log(data)

        if (data.length > 0) {
          let dataL = data.length;
          let arrTwo = [];
          for (let i = 0; i < dataL; i++) {
            arrTwo[i] = [];
            arrTwo[i].push(data[i].key);
            let itemarr = [];
            for (let item in data[i].valuemap) {
              console.log(data[i].valuemap[item])
              itemarr.push({
                key: item,
                value: data[i].valuemap[item]
              });
            }
            arrTwo[i].push(itemarr);
          }
          _this.setData({
            popList: arrTwo
          });
        }

      })
    },
    //获取商户店铺名称
    getShopInfo: function () {
      let _this = this;
      util.wxResquest({
        url: '/transport/api/searchshop',
        method: 'POST',
        data: ''
      }, function (res) {
        let data = res.data.data;
        shopData = data;
        _this.setData({
          shopname: data.shopName,
          shopid: data.shopId
        });
      })
    },
    bindPickerChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        logisticsIndex: e.detail.value
      })
    },
    toAddressList: function (e) {
      const flag = e.currentTarget.dataset.flag;
      const _this = this;
      console.log(flag)
      if (flag == 'receive') { //填写收件地址，不保存在地址列表中
        
        wx.navigateTo({
          url: '../add_address/add_address?flag=receive',
        })
      } else {
        app.globalData.address = _this.data.sendAddress;
        wx.navigateTo({
          url: '../add_address/add_address?flag=send',
        })
      }
    },
    toAddAddressList: function (e) {
      const flag = e.currentTarget.dataset.flag;
      const _this = this;
      console.log(flag)
      if (flag == 'receive') { //填写收件地址，不保存在地址列表中
        app.globalData.receiveAddress = _this.data.receiveAddress;
        wx.navigateTo({
          url: '../address/address?id=add&flag=receive',
        })
      } else {
        app.globalData.address = _this.data.sendAddress;
        wx.navigateTo({
          url: '../address/address?id=' + _this.data.sendAddress.id,
        })
      }
    },
    bindGoodsInput: function (e) {
      this.setData({
        'order.goodsname': e.detail.value
      });
    },
    // bindCompanyCodeInput: function (e) {
    //   this.setData({
    //     'order.company_code': e.detail.value
    //   });
    // },
    bindNumInput: function (e) {
      this.setData({
        'order.goodsnum': e.detail.value,
        'order.price': e.detail.value * 3.00
      });
    },
    bindInfoInput: function (e) {
      this.setData({
        'order.billinfo': e.detail.value
      });
    },
    handlePop: function (e) {
      const index = e.currentTarget.dataset.index;
      console.log(index);
      this.setData({
        popListItem: this.data.popList[index][1],
        popListIndexLin: index,
        popListItemIndexLin: -1

      })
    },
    handlePopItem: function (e) {
      const index = e.currentTarget.dataset.index;
      this.setData({
        popListItemIndex: index,
        popListItemIndexLin: index,
        popListIndex: this.data.popListIndexLin,
        popShow: false
      });
    },
    handleCancel: function () {
      this.setData({
        popShow: false,
        popListItem: this.data.popList[this.data.popListIndex][1],
      })
    },
    handlepopShow: function () {
      this.setData({
        popShow: true,
        popListIndexLin: this.data.popListIndex,
        popListItemIndexLin: this.data.popListItemIndexLin
      })
    }
  },
  ready(){
    this.getLogisticsList();
    this.getShopInfo();
    var that = this;
    console.log('保存')
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          lat: latitude,
          lng: longitude
        })
      }
    })
  }
})
