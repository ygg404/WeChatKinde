var MD5 = require('../lib/md5.js');

//日期
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

//签名
function getSign(signToken, timestamp, nonce, staffid, data, appSecret) {
  var signStr = "" + timestamp + nonce + staffid + signToken + data + appSecret;
  console.log("signStr:" + signStr);
  var signString = MD5.md5(signStr);
  signString = signString.toUpperCase();
  console.log('signString:' + signString);
  return signString;
}

//提示窗口(标题，内容, (错误提示=0 红色，普通提示=1，蓝色) )
function TipModel(Title, content, level = 1) {
  var mTitle = Title;
  var mContent = content;
  var mColor

  if (level == 0) {
    mColor = '#F21C2E'
  } else {
    mColor = '#075FA9'
  }
  wx.showModal({
    title: mTitle,
    content: mContent,
    confirmColor: mColor,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      }
    }
  });
}


module.exports = {
  formatTime: formatTime,
  getSign: getSign,
  TipModel: TipModel,

}
