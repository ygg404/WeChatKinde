// view/result/result.js
var WxParse = require('../../lib/wxParse/wxParse.js');
var Base64Parse = require('../../lib/Base64.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageData:'',
    eCount:'',
    eFirstTime:'',
    eTelCount:'',
    eImgHeight:'400',
    eImgZoom:1,
    eDescription:'',
    eIsAuto:0,
    eResult:'',
    //字体居中
    textAlign:'left',
    leftP:2,
 //   CodeData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.Result == 0 || (options.Result==1 && options.IsAuto==1))
    {

      this.setData({
        imageData: 'data:image/jpeg;base64,' + options.imageBase64Data,
        // eCount: options.queryCount,
        // eFirstTime: options.FirstSearchTime,
        // eTelCount: options.TelCount,
        textAlign: 'center',
        eImgHeight: 0,
        eDescription: options.Description,
        leftP:'-2',
      });
    }
    else{
      // if (options.Result == "IsNotValidNumeric" || options.Result == "IsNotValidSerialLength")
      // {
      //   this.setData({
      //     imageData: 'data:image/jpeg;base64,' + options.imageBase64Data,
      //     // eCount: options.queryCount,
      //     // eFirstTime: options.FirstSearchTime,
      //     // eTelCount: options.TelCount,
      //     textAlign: 'left',
      //     eImgHeight: 0,
      //     leftP: '2',
      //     eDescription: options.Description,
      //   });
      // }
      // else{
        this.setData({
          imageData: 'data:image/jpeg;base64,' + options.imageBase64Data,
          // eCount: options.queryCount,
          // eFirstTime: options.FirstSearchTime,
          // eTelCount: options.TelCount,
          textAlign: 'left',
          eImgHeight: options.ImageHeight * options.ImageZoom / 100,
          eDescription: options.Description,
        });
      // }
    }

    //WxParse.wxParse('article', 'html',"<img width='65%' src='https://mini.kd315.net/Content/images/false.png' ></img>",this,0);
    WxParse.wxParse('article', 'html', Base64Parse.Base64.decode(options.Description), this, 5);
  //  WxParse.wxParse('article', 'html', "<div style='background-image:https://mini.kd315.net/Content/images/false.png;width:80%;margin-left:0;'></div>", this, 5);
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
  // onPullDownRefresh: function () {
  
  // },

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