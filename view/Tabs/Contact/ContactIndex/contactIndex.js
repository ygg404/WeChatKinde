// view/Tabs/Contact/ContactIndex/contactIndex.js
var app = getApp();
var utils = require('../../../../utils/util.js');
var WxParse = require('../../../../lib/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //加载页面
    wx.request({
      url: app.globalData.WebUrl + 'GetJobList',
      method: 'GET',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },

      success: function (res) {
        var retCode = res.data.StatusCode;
        if (retCode == 200) {
          var joblist=[];
          for (var i = 0; i < res.data.Data.length; i++) {

            var con ="";
            if (res.data.Data[i].Content=="<p></p>"){
              con = res.data.Data[i].Description.replace(/<p>/g, "").replace(/<\/p>/g, "\n")
            }else{
              con = res.data.Data[i].Content.replace(/<p>/g, "").replace(/<\/p>/g, "\n")
            }
            joblist.push({
              job_num: "job" + i,
              job_id: res.data.Data[i].JobId,
              job_name: res.data.Data[i].Name,
              job_address: res.data.Data[i].Address,
              job_content: con
            });
          }
          that.setData({
            jobList: joblist
          });
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

  /**
   * 跳转职位详情
   */
  jobInfoView: function (event){
    wx.navigateTo({
      url: '../JobInfo/jobInfo?jobId=' + event.target.dataset.index
    })
  }

  
})