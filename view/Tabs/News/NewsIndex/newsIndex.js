// view/Tabs/News/NewsIndex/newsIndex.js
var app = getApp();
var utils = require('../../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false,
    page : 1,
    //页面加载失败标记
    Error404 :false,
    //新闻数据加载完毕
    isEnd : false,
    //新闻栏
    news_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.NewsLoad(this);
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
    if (!this.data.isEnd){
      var curpage = this.data.page + 1;
      this.setData({
        page : curpage
      });
      this.NewsLoad(this);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 新闻加载
   */
  NewsLoad: function(that){
    //加载页面
    wx.request({
      url: app.globalData.WebUrl + 'GetNewsPageList?page=' + that.data.page,
      method: 'GET',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },

      success: function (res) {
        var retCode = res.data.StatusCode;
        if (retCode == 200) {
          //新闻数量为0则加载完毕
          if(res.data.Data.length == 0){
            that.setData({
              isEnd:true
            });
            return;
          }
          var newslist = that.data.news_list;
          for (var i = 0; i < res.data.Data.length; i++) {
            //内容摘要
            var reg = /<span .*?>([^<]*)<\/span>/g;
            var content = res.data.Data[i].Content.match(reg);
            var maintext = '';
            if(content != null){
              for(var j=0; j<content.length; j++){
                maintext += content[j].replace(/&nbsp;/g, "").replace(/<br\/>/g, "").replace(/ /g, "").replace(/<.*?>/g,"");
              }
              if(maintext==null || maintext.length < 10){
                maintext = res.data.Data[i].Title;
              }
            }else{
              maintext = res.data.Data[i].Title;
            }

            newslist.push({
              news_url: '../NewsDetail/newsDetail?newsId=' + res.data.Data[i].NewsId,
              news_title: res.data.Data[i].Title,
              news_date: res.data.Data[i].CreateDate.split('T')[0],
              new_content: maintext
            });
          }
          that.setData({
            news_list: newslist
          });

        } else {
          utils.TipModel('错误', res.data.Info, 0)
        }
      },
      fail: function (res) {
        that.setData({
          Error404: true
        });
      },
      complete: function (res) {
        that.setData({
          loadingHidden: true,
        });
      }
    });
  },

})