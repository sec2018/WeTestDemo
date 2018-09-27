var rootDocument = 'http://10.84.6.80:8080/transport/';
function req(url,data,cb){
  wx.request({
    url: rootDocument + url,
    data: data,
    method: 'POST',
    // header: {'Content-Type':'application/json'},
    success: res => {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function(){
      return typeof cb == "function" && cb(false)
    }
  })
}

module.exports = {
  req:req
}