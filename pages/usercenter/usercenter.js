// pages/usercenter/usercenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:true,
    userInfo:{
      avatarurl:'../../images/image_add.jpg'
    },
    role: '商家',
    phone: '053168828911'
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
    let roleid = wx.getStorageSync('roleid');
    let userInfo = wx.getStorageSync('userInfo');
    let role = '';
    switch (roleid) {
      case '3':
        role = '承运员';
        break;
      case '4':
        role = '物流公司';
        break;
      default:
        role = '商家';
        break;
    }
    this.setData({
      role:role,
      userInfo: userInfo
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  changeRole:function(){
    let _this = this;
    wx.showActionSheet({
      // itemList: ['商户','承运员','物流公司','退出登录'],
      // success:function(res){
      //   console.log(res.tapIndex);
      //   _this.loginout();
      //   switch (res.tapIndex){
      //     case 0:
      //       //选择的是商户

      //       break;
      //     case 1:
      //       //选择的是承运员

      //       console.log(1);
      //       break;
      //     case 2:
      //       //选择的是物流公司

      //       console.log(2);
      //       break;
      //   }
      // }
      itemList: ['退出登录'],
      success:function(res){
        console.log(res.tapIndex);
        _this.loginout();
        wx.navigateTo({
          url: '../login/login',
        })
      }
    })
  },
  loginout: function () {
    wx.clearStorageSync();
  },
  callPhone(){
    let _this = this;
    wx.makePhoneCall({
      phoneNumber: _this.data.phone //仅为示例，并非真实的电话号码
    })
  }
})