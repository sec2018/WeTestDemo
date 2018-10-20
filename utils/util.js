var app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function loginAjax(dataParam,cb){
  dataParam.code = app.globalData.code;
  //发起网络请求
  wxResquest({
    url: '/transport/wx/wxlogin',
    data: dataParam,
    method: 'POST'
  }, function (result){
    let data = result.data.data;
    console.log(data.data)
    wx.setStorageSync("token", data.data);
    app.globalData.token = data.data;
    console.log(app.globalData)
    if(cb) {
      cb()
    }
  })
}
/**
 * 网络请求封装
 * resquestParam wx.resuest 数据
 * url  请求地址
 * data 请求数据
 * header 请求头部
 * method 有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
 * successCb 成功回调
 * failedCb 失败回调
 */
function wxResquest(resquestParam, successCb, failedCb) {
  const token = wx.getStorageSync('token');
  let headerParam = Object.assign({}, {
    'Content-Type': 'application/x-www-form-urlencoded',
    'token': token,
    'roleid': '-1'
  }, resquestParam.header);
  wx.request({
    url: app.globalData.apiRoot + resquestParam.url,
    data: resquestParam.data || '',
    header: headerParam,
    method: resquestParam.method,
    success: function (res) {
      if(res.data.code == 200){
        if (successCb) {
          successCb(res)
        }
      } else if (res.data.code == '500210') { //无效凭证，请重新登录
        loginByWxchat(function () {
          wx.hideLoading();
          wx.showModal({
            title: '',
            content: '当前登陆失效，请重新登录',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wxResquest(resquestParam, successCb, failedCb)
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        })
      } else {
        if (failedCb) {
          failedCb(res)
        } else {
          wx.hideLoading();
          if (res.data.msg) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '发生未知错误，请联系管理人员',
              icon: 'none',
              duration: 2000
            })
          }
        }
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
/**
 * 微信登录事件
 */
function loginByWxchat(cb) {
  wx.login({
    success: function (res) {
      app.globalData.code = res.code;
      wx.getSetting({
        success(setRes) {
          // 判断是否已授权
          if (!setRes.authSetting['scope.userInfo']) {
            wx.navigateTo({
              url: '../login/login',
            })
          } else {
            wx.navigateTo({
              url: '../login/login',
            })
            return;
            //获取用户信息
            wx.getUserInfo({
              lang: "zh_CN",
              success: function (userRes) {
                console.log(userRes)
                //发起网络请求
                loginAjax({
                  encryptedData: userRes.encryptedData,
                  iv: userRes.iv
                }, cb)
              }
            })
          }
        }
      })
    },
    fail: function (res) {
      console.log("获取登录code fail")
      console.log(res)
    }
  });
}
module.exports = {
  formatTime: formatTime,
  wxResquest: wxResquest,
  loginAjax: loginAjax,
  loginByWxchat: loginByWxchat
}
