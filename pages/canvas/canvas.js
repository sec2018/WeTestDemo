// pages/canvas/canvas.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    srcUrl:'',
    canvasData:[
      ['表格11', '表格12', '表格13', '表格14', '表格15']
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('secondCanvas')
    let _this = this;
    context.setStrokeStyle("#000000"); //设置描边颜色
    context.setLineWidth(1); //设置线条宽度
    context.rect(0, 0, 320, 240); //绘制矩形
    context.stroke(); //画出当前路径的边框
    context.beginPath()
    context.setStrokeStyle("#000000");
    context.setLineWidth(1);
    for(let i=0; i<7; i++){
      context.moveTo(0, 30+30*i);
      context.lineTo(320, 30 + 30 * i);
    }
    // for (let i = 0; i < 7; i++) {
    //   context.moveTo(40+40*i, 0);
    //   context.lineTo(40+40*i, 240);
    // }
    context.setFontSize(14);
    for(let i=0; i<this.data.canvasData[0].length; i++){
      let len = this.data.canvasData[0][i].length;
      let lenNext = 0;
      if (i == this.data.canvasData[0].length-1){

      } else {
        lenNext = this.data.canvasData[0][i+1].length;
      }
      context.fillText(this.data.canvasData[0][i], 2 + ((len + 4) * 5 + lenNext * i * 5)*i, 20);
      context.moveTo((len+2)*10 + lenNext * i*10, 0);
      context.lineTo((len + 4)*5 + lenNext * i*5, 240);
    }
    context.stroke()
    context.draw(true,function(){
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        destWidth: 100,
        destHeight: 100,
        canvasId: 'secondCanvas',
        success(res) {
          console.log(res.tempFilePath);
          _this.setData({
            srcUrl: res.tempFilePath
          })
        }
      })
      
    })
  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
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

  }
})