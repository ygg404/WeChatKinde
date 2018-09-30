// view/Tabs/News/NewsDetail/newsDetail.js
var app = getApp();
var utils = require('../../../../utils/util.js');
var WxParse = require('../../../../lib/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden : false,
    //新闻详情
    news_detail:{
      title: '',
      date: '',
      content:'',
      Error404:false
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var newsId = options.newsId;

    //获取文章被阅读的标记
    var isRead = true;
    if (wx.getStorageSync(newsId) == null || wx.getStorageSync(newsId) == "" ){
        isRead = false;
    }

    var that = this;
    //加载页面
    wx.request({
      url: app.globalData.WebUrl + 'GetNewsEntity?newsId=' + newsId + '&isRead=' + isRead,
      method: 'GET',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },

      success: function (res) {
        var retCode = res.data.StatusCode;
        if (retCode == 200) {
          that.setData({
            news_detail: {
              title: res.data.Data.Title,
              date: '发布于:'+res.data.Data.CreateDate.split('T')[0],
              content: res.data.Data.Content
            }
          });
          WxParse.wxParse('article', 'html', res.data.Data.Content, that, 5);
          //获取新闻成功则标记该文章已经阅读
          wx.setStorage({
            key: newsId ,
            data: '1',
          });

        } else {
          utils.TipModel('错误', res.data.Info, 0)
        }
      },
      fail: function (res) {
        that.setData({
          Error404: true
        })
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
  
  }
})