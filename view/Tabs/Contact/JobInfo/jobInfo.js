// view/Tabs/Contact/JobInfo/jobInfo.js
var app = getApp();
var utils = require('../../../../utils/util.js');
var WxParse = require('../../../../lib/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Name: '',
    Address: '',
    Description: '',
    Content: '',
    descShow :true,
    conShow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //加载页面
    wx.request({
      url: app.globalData.WebUrl + 'GetJobEntity?JobId='+ options.jobId,
      method: 'GET',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },

      success: function (res) {
        var retCode = res.data.StatusCode;
        var jobInfo =[];
        if (retCode == 200) {
          that.setData({
            Name : res.data.Data.Name,
            Address : res.data.Data.Address,
            Description : res.data.Data.Description,
            Content : res.data.Data.Content
            });
          //描述和要求为空 则隐藏
          if (res.data.Data.Description == "<p></p>"){
            that.setData({
              descShow: false,
            });
          }
          if (res.data.Data.Content == "<p></p>"){
            that.setData({
              conShow: false,
            });
          }
          WxParse.wxParse('Description', 'html', res.data.Data.Description, that, 5);
          WxParse.wxParse('Content', 'html', res.data.Data.Content, that, 5);
        } else {
          utils.TipModel('错误', res.data.Info, 0)
        }
      },
      fail: function (res) {
      },
      complete: function (res) {
        that.setData({
          loadingHidden: true,
        });
      }
    });
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

})