// pages/usercenter/usercenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:true,
    userInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
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
  changeRole:function(){
    let _this = this;
    wx.showActionSheet({
      itemList: ['商户','承运员','物流公司','退出登录'],
      success:function(res){
        console.log(res.tapIndex);
        _this.loginout();
        switch (res.tapIndex){
          case 0:
            break;
          case 1:
            break;
          case 2:
            break;
        }
      }
    })
  },
  loginout: function () {
    wx.setStorageSync('userInfo', null);
    wx.setStorageSync('token',null);
    wx.setStorageSync('role', -1);
    console.log(wx.getStorageSync('userInfo'));
  }
})