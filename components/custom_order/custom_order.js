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
            let line_id = orderDetail.line_id;
            let popitemindex = 0;
            let popindex = 0;
            let popListL = this.data.popList.length;
            let popitemarr = [];
            for (let i = 0; i < popListL; i++){
              let popitem = this.data.popList[i][1];
              for (let j = 0; j < popitem.length;j++){
                if (popitem[j].key == line_id) {
                  popitemindex = j;
                  popindex = i;
                  popitemarr = popitem;
                  break;
                }
                
              }
              if(popitemarr.length >0){
                break;
              }
              console.log(i, 'hhhhhhhhhhhh')
            }
            let pay_method_id = orderDetail.pay_method;
            let pay_method_index = 0;
            for (let i = 0; i < this.data.payArray.length; i++) {
              if (this.data.payArray[i].id == pay_method_id) {
                pay_method_index = i;
                break;
              }
            }
            this.setData({
              order: {
                id: orderDetail.id,
                company_code: orderDetail.company_code,
                company_id: orderDetail.company_id,
                goodsname: orderDetail.goodsname,
                goodsnum: orderDetail.goodsnum,
                billinfo: orderDetail.billinfo,
                price: orderDetail.price,
                keepfee: orderDetail.keepfee
              },
              receiveAddress: {
                uname: orderDetail.rec_name,
                tel: orderDetail.rec_tel,
                pro_city: orderDetail.rec_procity,
                detail_addr: orderDetail.rec_detailarea
              },
              shopname: orderDetail.shop_name,
              shopid: orderDetail.shop_id,
              popListItem: popitemarr,
              popListIndex: popindex,
              popListItemIndexLin: popitemindex,
              popListIndexLin: popindex,
              popListItemIndex: popitemindex,
              payMethodIndex: pay_method_index,
              giveValue: orderDetail.give_method,
              waitValue: orderDetail.waitnote
            })
            console.log(orderDetail)
          } else {
            this.setData({
              order: {
                company_code: '',
                company_id: -1,
                goodsname: '',
                goodsnum: '',
                billinfo: '',
                price: 0,
                keepfee: 0
              },
              receiveAddress: {
                uname: '',
                tel: '',
                pro_city: '',
                detail_addr: ''
              },
              shopname: shopData.shopName,
              shopid: shopData.shopId,
              logisticsList: ['顺丰', '申通', '圆通'],
              logisticsIndex: 0,
              popShow: false,
              popListItem: [],
              popListIndex: -1,
              popListIndexLin: -1,
              popListItemIndexLin: -1,
              popListItemIndex: -1,
              payMethodIndex: 0,
              giveValue: 1,
              waitValue: 1
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
      company_id: -1,
      goodsname: '',
      goodsnum: '',
      billinfo: '',
      price: 0,
      keepfee: 0
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
    lat: '',
    payArray: [{ id: 1, name: '现付' }, { id: 2, name: '到付' }, { id: 3, name: '回付' }, { id: 4, name: '月结' }],
    payMethodIndex: 0,
    giveArray: [
      { name: 1, value: '送货', checked: 'true' },
      { name: 2, value: '自提' },
    ],
    giveValue: 1,
    waitArray: [
      { name: 1, value: '是', checked: 'true' },
      { name: 2, value: '否' },
    ],
    waitValue: 1
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
      if ( !_this.data.receiveAddress.pro_city || !_this.data.order.goodsname || !_this.data.order.goodsnum || _this.data.popListItemIndex == -1) {
        wx.showToast({
          title: '信息填写不完整',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      let param = {
        company_code: '',
        goodsname: _this.data.order.goodsname,
        goodsnum: _this.data.order.goodsnum,
        shop_id: _this.data.shopid,
        shop_name: _this.data.shopname,
        company_name: _this.data.popListItem[_this.data.popListItemIndex].value,
        batch_code: '0',
        lat: _this.data.lat,
        lng: _this.data.lng,
        billinfo: _this.data.order.billinfo,
        rec_name: _this.data.receiveAddress.uname,
        rec_tel: _this.data.receiveAddress.tel,
        rec_procity: _this.data.receiveAddress.pro_city,
        rec_detailarea: _this.data.receiveAddress.detail_addr,
        price: _this.data.order.price,
        line_id: _this.data.popListItem[_this.data.popListItemIndex].key,
        pay_method: _this.data.payArray[_this.data.payMethodIndex].id,
        give_method: _this.data.giveValue,
        keepfee: _this.data.order.keepfee,
        waitnote: _this.data.waitValue
      }
      console.log(param, 'hahahah')
      if(_this.data.order.id){
        param.id = _this.data.order.id;
        param.company_id = _this.data.order.company_id;
      }
      this.triggerEvent('saveOrderHandle', param)
    },
    //下单接口
    createOrder: function () {
      let _this = this;
      // let logistics = _this.data.logisticsList[_this.data.logisticsIndex];
      let param = {
        sender_name: _this.data.sendAddress.uname,
        company_code: _this.data.order.company_code,
        goodsname: _this.data.order.goodsname,
        goodsnum: _this.data.order.goodsnum,
        sender_tel: _this.data.sendAddress.tel,
        shop_id: _this.data.shopid,
        shop_name: _this.data.shopname,
        // company_id: logistics.companyId,
        // company_name: logistics.companyName,
        company_name: _this.data.popListItem[_this.data.popListItemIndex].value,
        line_id: _this.data.popListItem[_this.data.popListItemIndex].key,
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
        'order.price': e.detail.value * 2.00
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
    },
    //付款方式
    bindPayMethodChange(e) {
      this.setData({
        payMethodIndex: e.detail.value
      })
    },
    //交付方式
    giveMethodChange(e) {
      this.setData({
        giveValue: e.detail.value
      })
      // console.log('radio发生change事件，携带value值为：', e.detail.value)
    },
    //代收货款
    bindKeepFeeInput(e) {
      this.setData({
        'order.keepfee': e.detail.value
      });
      console.log(this.data.order, 'daishoukuan')
    },
    //等通知放货
    waitNoteChange(e) {
      this.setData({
        waitValue: e.detail.value
      })
      // console.log('radio发生change事件，携带value值为：', e.detail.value)
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
