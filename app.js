//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    let _this = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    let EXPIRETIME = 12000;
    
    // 登录
    wx.login({
      success: function(res) {
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
                    success: function(userRes) {
                      //发起网络请求
                      wx.request({
                        url: 'http://10.84.6.182:8080/transport/wx/wxlogin',
                        data: {
                          code: res.code,
                          encryptedData: userRes.encryptedData,
                          iv: userRes.iv
                        },
                        header: {
                          "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: 'POST',
                        //服务端的回掉
                        success: function(result) {
                          var data = result.data.result;
                          data.expireTime = Date.now() + EXPIRETIME;
                          wx.setStorageSync("userInfo", data);
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
                success: function(userRes) {
                  console.log(userRes)
                  //发起网络请求
                  wx.request({
                    url: 'http://10.84.6.182:8080/transport/wx/wxlogin',
                    data: {
                      code: res.code,
                      encryptedData: userRes.encryptedData,
                      iv: userRes.iv
                    },
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    success: function(result) {
                      console.log(result.data)
                      let data = {
                        openid: result.data.openid,
                        session_key: result.data.session_key
                      }
                      data.expireTime = Date.now() + EXPIRETIME;
                      wx.setStorageSync("userInfo", data);
                      _this.globalData.userInfo = data;
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    apiRoot: 'HTTP///'
  }
})