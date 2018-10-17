/**
 * 第一次进入时，设置地图满屏，设置控件位置
 */
function setPageStyle(cb) { //设置地图高度，控件位置
  var controls = [];
  wx.getSystemInfo({
    success: function (res) {
      //控件position 0 指针  1 定位 2 用车 3 用户 4 故障     设置控件在页面上的位置
      controls = [{
        id: 0,
        iconPath: '../../images/zhizhen.png',
        position: {
          left: 50,
          top: 0,
          width: 16.5,
          height: 25
        }
      }, {
        id: 1,
          iconPath: '../../images/dingwei.png',
        position: {
          left: 30,
          top: 0,
          width: 45,
          height: 45
        },
        clickable: true
      },
      {
        id: 2,
        iconPath: '../../images/lock.png',
        position: {
          left: 50,
          top: 0,
          width: 170,
          height: 45
        },
        clickable: true
      }, {
        id: 3,
        iconPath: '../../images/user.png',
        position: {
          left: 50,
          top: 0,
          width: 45,
          height: 45
        },
        clickable: true
      }, {
        id: 4,
        iconPath: '../../images/guzhang.png',
        position: {
          left: 30,
          top: 0,
          width: 45,
          height: 45
        },
        clickable: true
      }];
      controls[0].position.left = (res.windowWidth - controls[0].position.width) / 2;
      controls[0].position.top = (res.windowHeight - controls[0].position.height) / 2;
      controls[1].position.top = res.windowHeight - controls[1].position.height - 20;
      controls[2].position.left = (res.windowWidth - controls[2].position.width) / 2;
      controls[2].position.top = res.windowHeight - controls[2].position.height - 20;
      controls[3].position.top = res.windowHeight - controls[3].position.height - 20;
      controls[3].position.left = res.windowWidth - controls[3].position.width - 30;
      controls[4].position.top = res.windowHeight - controls[4].position.height - 85;
      cb({
        controls: controls,
        height: res.windowHeight
      });
    }
  });
}
module.exports = {
  setPageStyle: setPageStyle
}