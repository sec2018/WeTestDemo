var app = getApp();
var roleid = 0;
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function loginAjax(cb){
  let dataParam = {};
  dataParam.code = app.globalData.code;
  dataParam.encryptedData = app.globalData.encryptedData
  dataParam.iv = app.globalData.iv;
  console.log('登陆接口')
  //发起网络请求
  wxResquest({
    url: '/transport/wx/wxlogin',
    data: dataParam,
    method: 'POST'
  }, function (result){
    let data = result.data.data;
    let ro = data.role;
    let checkStatus = data.status;
    console.log(ro)
    wx.setStorageSync('userInfo', data.userinfo);
    if(ro && roleid && ro != roleid){
      let rostr = '商户';
      if(ro == 2){
        rostr = '商户';
      }
      if (ro == 3) {
        rostr = '承运员';
      }
      if (ro == 4) {
        rostr = '快递公司';
      }
      wx.removeStorageSync('roleid');
      wx.showModal({
        title: '',
        content: '您已是'+rostr+',不能选择其他角色，请选择角色 “'+rostr+'“ 登录',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            
          }
        }
      })
      return;
    }
    if (!checkStatus) {
      wx.hideLoading()
      // wx.showModal({
      //   title: '',
      //   content: result.data.msg,
      //   showCancel: false,
      //   success: function (res) {
      //     if (res.confirm) {
      //       wx.navigateTo({
      //         url: '../login/login',
      //       })
      //     }
      //   }
      // });
      if (data.userinfo.trancheckstatus == 0) {
        wx.showModal({
          title: '',
          content: '用户在审核中',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              // wxResquest(resquestParam, successCb, failedCb)
              // wx.navigateTo({
              //   url: '../login/login',
              // })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else if (data.userinfo.trancheckstatus == 2) { //审核不通过
        wx.showModal({
        title: '',
        content: result.data.msg,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.setStorageSync("token", data.token);
            app.globalData.token = data.token;
            wx.navigateTo({
              url: '../register_info/register_info?flag=update&id='+data.userinfo.roleid,
            })
          }
        }
      });
        
      }
      return;
    } else {
      wx.setStorageSync("token", data.token);
      app.globalData.token = data.token;
      console.log(app.globalData)
      if (cb) {
        cb()
      }
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
  let token = wx.getStorageSync('token');
  let userInfoFrom = wx.getStorageSync('userInfo');
  roleid = wx.getStorageSync('roleid');
  console.log(token+' tokn')
    if (!roleid && resquestParam.header && !resquestParam.header.roleid){
      
      loginByWxchat();
      return;
    }
  if (!token){
    console.log(token + 'tokn2', resquestParam.url)
    token = "";
    if (resquestParam.url.indexOf('wxlogin') == -1){
      console.log('调微信')
      loginByWxchat();
      return
    }
  }
  // if(!userInfoFrom){

  // } else {
  //   if (userInfoFrom.trancheckstatus == 0){
  //     wx.showModal({
  //       title: '',
  //       content: '用户在审核中',
  //       showCancel: false,
  //       success: function (res) {
  //         if (res.confirm) {
  //           // wxResquest(resquestParam, successCb, failedCb)
  //           // wx.navigateTo({
  //           //   url: '../login/login',
  //           // })
  //         } else if (res.cancel) {
  //           console.log('用户点击取消')
  //         }
  //       }
  //     })
  //   } else if (userInfoFrom.trancheckstatus == 2) { //审核不通过
  //     wx.navigateTo({
  //       url: '../register_info/register_info?id='+userInfoFrom.roleid,
  //     })
  //   }
  // }

  let headerParam = Object.assign({}, {
    'Content-Type': 'application/x-www-form-urlencoded',
    'token': token,
    'roleid': roleid
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
        wx.hideLoading();
        wx.showModal({
          title: '',
          content: '当前登陆失效，请重新登录',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              // wxResquest(resquestParam, successCb, failedCb)
              wx.navigateTo({
                url: '../login/login',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else if(res.data.code == '500104'){ //商户
        app.globalData.token = res.data.data.token;
        wx.setStorageSync('token', res.data.data.token);
        wx.navigateTo({
          url: '../register_info/register_info?id=2',
        })
      } else if(res.data.code == '500106'){ //承运员
        app.globalData.token = res.data.data.token;
        wx.setStorageSync('token', res.data.data.token);
        wx.navigateTo({
          url: '../register_info/register_info?id=3',
        })
      } else if (res.data.code == '500105') { //物流公司
        app.globalData.token = res.data.data.token;
        wx.setStorageSync('token', res.data.data.token);
        wx.navigateTo({
          url: '../register_info/register_info?id=4',
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
            // wx.showToast({
            //   title: '发生未知错误，请联系管理人员',
            //   icon: 'none',
            //   duration: 2000
            // })
            wx.showModal({
              title: '',
              content: '当前登陆失效，请重新登录',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  // loginByWxchat();
                  wx.navigateTo({
                    url: '../login/login',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }
      }
    },
    fail: function (res) {
      console.log(res)
      wx.hideLoading();
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
          } 
          else {
            //获取用户信息
            console.log('进去录')
            wx.getUserInfo({
              lang: "zh_CN",
              success: function (userRes) {
                console.log(userRes)
                app.globalData.encryptedData = userRes.encryptedData;
                app.globalData.iv = userRes.iv;
                //发起网络请求
                // loginAjax({
                //   encryptedData: userRes.encryptedData,
                //   iv: userRes.iv
                // }, cb)

                loginAjax(function () {
                  // wx.setStorageSync('userInfo', userRes.userInfo);
                  wx.navigateBack({
                    delta: '1'
                  })
                });
              },
              fail: function(res){
                console.log(res)
              }
            });
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
