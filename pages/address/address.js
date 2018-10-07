// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {
      name: '',
      address: ''
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
  onClickLocation: function () {
    let _this = this;
    wx.chooseLocation({
      success(res) {
        console.log(res)
        const name = res.name;
        const address = res.address;
        _this.setData({
          'address.name': name,
          'address.address': address
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  onSave: function () {
    const token = wx.getStorageSync('token');
    const _this = this;
    wx.request({
      url: 'http://192.168.100.107:8080/transport/api/addaddr',
      data: {
        'uname': '123',
        'tel': '11',
        'pro_city': _this.data.address.name,
        'detail_addr': _this.data.address.address,
        'isdefault': 0
      },
      header: { 'token': token, 'content-type': 'application/x-www-form-urlencoded'},
      method: 'POST',
      success: function (res) {
        console.log(res)
        if(res.data.code == 1002) {
          wx.setStorageSync('token', '');
          wx.login({
            success: function (res) {
              wx.getSetting({
                success(setRes) {
                  // 判断是否已授权
                  if (!setRes.authSetting['scope.userInfo']) {
                    // 授权访问
                    wx.authorize({
                      scope: 'scope.userInfo',
                      success() {
                        //获取用户信息
                        wx.getUserInfo({
                          lang: "zh_CN",
                          success: function (userRes) {
                            console.log(userRes)
                            //发起网络请求
                            wx.request({
                              url: 'http://192.168.100.107:8080/transport/wx/wxlogin',
                              data: {
                                code: res.code,
                                encryptedData: userRes.encryptedData,
                                iv: userRes.iv
                              },
                              header: {
                                "Content-Type": "application/x-www-form-urlencoded"
                              },
                              method: 'POST',
                              //服务端的回调.
                              success: function (result) {
                                console.log(result)
                                var data = result.data.result;
                                data.expireTime = Date.now() + EXPIRETIME;
                                wx.setStorageSync("token", data.token);
                                userInfo = data;
                              }
                            })
                          }
                        })
                      }
                    })
                  } else {
                    //获取用户信息
                    wx.getUserInfo({
                      lang: "zh_CN",
                      success: function (userRes) {
                        //发起网络请求
                        wx.request({
                          url: 'http://192.168.100.107:8080/transport/wx/wxlogin',
                          data: {
                            code: res.code,
                            encryptedData: userRes.encryptedData,
                            iv: userRes.iv
                          },
                          header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                          },
                          method: 'POST',
                          success: function (result) {
                            wx.setStorageSync("token", result.data.token);
                          }
                        })
                      }
                    })
                  }
                }
              })
            }
          })
        }
      },
      fail: function (res) {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})