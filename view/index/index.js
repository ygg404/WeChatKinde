// view/index/index.js
var xmlParser = require("../../lib/xmldom/dom-parser.js");
var MD5 = require('../../lib/md5.js');
var Base64Parse = require('../../lib/Base64.js');
var utils = require('../../utils/util.js');
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showvideo: true,
    numQuery: '', //输入码
    scanQuery:'', //扫描码
    btnDisable: false,
    numStorage: '', //用户输入的防伪码存储值

    //跳转到页面顶部
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    isScan: false,
    //轮播
    banner_list: [{
      banner_id: 0,
      banner_image: '/image/k1.jpg'
    }, {
      banner_id: 1,
      banner_image: '/image/k2.jpg'
    }, {
      banner_id: 2,
      banner_image: '/image/k3.jpg'
    }, {
      banner_id: 3,
      banner_image: '/image/k4.jpg'
    }, {
      banner_id: 4,
      banner_image: '/image/k5.jpg'
    }],
    //类目
    category_list: [{
      category_id:  "../Tabs/Business/business",
      category_name: '主营业务',
      category_color: '#FFFFFF',
      category_image: '/image/cp.png'
    }, {
      category_id: "../Tabs/Solution/index/solution",
      category_name: '解决方案',
      category_color: '#FFFFFF',
      category_image: '/image/fan.png'
    }, {
      category_id: '../Tabs/News/NewsIndex/newsIndex',
      category_name: '新闻动态',
      category_color: '#FFFFFF',
      category_image: '/image/new.png'
    }, {
      category_id: '../Tabs/Contact/ContactIndex/contactIndex',
      category_name: '联系我们',
      category_color: '#FFFFFF',
      category_image: '/image/lx.png'
    }],
    //加载隐藏
    loadingHidden: true,
    //合作伙伴
    currentTab: 0,
    currentTabNum: 0,
    partner_list: [{
      partner_id: 0,
      partner_image: '/image/partner1.jpg'
    }, {
      partner_id: 1,
      partner_image: '/image/partner2.jpg'
    }, {
      partner_id: 2,
      partner_image: '/image/partner3.jpg'
    }],
    //新闻栏
    news_list: [{
      news_url: 0,
      news_title: '热烈祝贺正迪被授予“专利创新先进单位”称号',
      news_date: '2017/10/16'
    }, {
      news_url: 1,
      news_title: '秋高气爽迎国庆，花好月圆迎中秋',
      news_date: '2017/10/16'
    },],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    var scene = decodeURIComponent(options.scene);
    //小程序二维码带有参数 
    if(scene != null && scene != "undefined" && scene != ""){
      //直接进入查询
      this.getRequest(this , scene);

    }else{
      //获取token
      this.getToken(this);
      //获取前三条新闻
      this.AddNews(this);
    }
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var that = this;
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.setData({
        btnDisable: false,
        loadingHidden: true,
        currentTab: 0,
        numQuery: '',
      });
    }, 1500);
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
   * 添加首页新闻栏（前三条）
   */
  AddNews:function(that){
    //获取新闻资讯（前三条）
    wx.request({
      url: app.globalData.WebUrl + 'GetTopNews?num=3',
      method: 'GET',
      // data: 'b=' + this.data.numQuery,    //参数为键值对字符串
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      success: function (res) {
        var retCode = res.data.StatusCode;
        if (retCode == 200) {
          var newslist = [];
          for( var i = 0; i<res.data.Data.length; i++ ){
            newslist.push({
              news_url: '/view/Tabs/News/NewsDetail/newsDetail?newsId=' + res.data.Data[i].newsid,
              news_title: res.data.Data[i].title,
              news_date: res.data.Data[i].createdate.split('T')[0]
            });
          }
          that.setData({
            news_list : newslist
          });

        } else {
          utils.TipModel('错误', res.data.Info, 0)
        }
      },
      fail: function (res) {
        ;
        //utils.TipModel('错误', '网络异常', 0)
      },
      complete: function (res) {
        that.setData({
          loadingHidden: true,
        });
      }
    });
  },

  /**
   * 查询按钮
   */
  queryBtnTap: function (e) {

    if (this.data.numQuery == '') {
      return;
    }

    this.setData({
      btnDisable: true,
      isScan: false
    });
 
    this.getResult(this);
    // var that = this;
    //this.getToken(this);
  },

  /**
   * 二维码扫描
   */
  recognizeCode: function () {
    //小程序API
    var that = this;
    wx.scanCode({

      success: function (res) {
        console.log("code :" + res.result);
        var scanCode = res.result.substring(res.result.indexOf('=') + 1, res.result.length);

        that.setData({
          btnDisable: true,
          scanQuery: scanCode,
          isScan: true
        });

        that.getResult(that);
      },
      fail: function () {
        // fail
        utils.TipModel('错误', '扫描失败！', 0);
      },
      complete: function () {
        // complete
      }
    })
  },

  /**
   * 获取查询结果
   */
  getResult: function(that){
    var num ="";
    //输入方式查询
    if (that.data.isScan == false) {
      num = that.data.numQuery;
      //防伪码必须是14位 20位
      if ((that.data.numQuery.length != 14) && (that.data.numQuery.length != 20)) {
        console.log("len:" + that.data.numQuery.length);

        that.setData({
          btnDisable: false
        });
        
        utils.TipModel('提示', '请输入14位或20位防伪码');
        return;
      }
    }
    //扫码方式查询
    else{
      num = that.data.ScanQuery;
    }

    that.getRequest(that , num);

  },

  /**
   * request查询结果
   */
  getRequest : function(that,num){
    that.setData({
      loadingHidden: false,
      showvideo: false,
      isScan: false
    });

    var staffid = app.staffId;
    var timestamp = Date.parse(new Date());
    var nonce = parseInt(2147483647 * Math.random());
    var query = 'serialNo' + that.data.numQuery;
    var sign = utils.getSign(app.SignToken, timestamp, nonce, staffid, query, app.globalData.AppSecret);

    wx.request({
      url: app.globalData.WebUrl + 'Verify?b=' + num,
      method: 'GET',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'staffid': staffid,
        'timestamp': timestamp,
        'nonce': nonce,
        'query': query,
        'signature': sign,
      },
      success: function (res) {
        // success 
        var retCode = res.data.StatusCode;
        //获取成功
        if (retCode == 200) {
          wx.navigateTo({
            url: '../result/result?eResult=' + Base64Parse.Base64.encode(res.data.Data)
          });
        } else {
          utils.TipModel('错误', res.data.Info, 0);
        }

      },
      fail: function (res) {
        // fail
        console.log("fail:" + res.data);
        utils.TipModel('错误', '网络异常', 0);
      },
      complete: function () {
        // complete
        that.setData({
          loadingHidden: true,
          showvideo: true,
          btnDisable: false,
        });
      }
    });
  },

  /**
  * 获取Token
  */
  getToken: function (that) {

    wx.request({
      url: app.globalData.WebUrl + "GetToken?staffId=" + app.globalData.StaffId ,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // 设置请求的 header  
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success: function (res) {
        // success 
        var retCode = res.data.StatusCode;
        console.log("ret:" + res.data.StatusCode);
        //获取token成功
        if (retCode == 200) {
          var SignToken = res.data.Data.SignToken;
          console.log("signToken:" + SignToken);
        }else{
          utils.TipModel('错误', res.data.Info, 0);
        }

      },
      fail: function (res) {
        // fail
        console.log("fail:" + res.data);
        // utils.TipModel('错误' , '网络异常' , 0);
         
      },
      complete: function () {
        // complete
      }
    })

  },

  /*
  *获取防伪码
  */
  numInput: function (e) {
    this.setData({
      numQuery: e.detail.value
    });

  },

  //合作伙伴
  /*** 滑动切换tab***/
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTabNum: e.detail.current });
    // console.log(e.detail.current);
  },
  /*** 点击上图切换***/
  preNav: function (e) {
    var that = this;
    var currentTabNum = that.data.currentTabNum;
    if (currentTabNum == 0) {
      that.setData({
        currentTab: 2
      });
    }
    else {
      that.setData({
        currentTab: currentTabNum - 1
      });
    }
  },
  /*** 点击下图切换***/
  nextNav: function (e) {
    var that = this;
    var currentTabNum = that.data.currentTabNum;
    if (currentTabNum == 2) {
      that.setData({
        currentTab: 0
      });
    }
    else {
      that.setData({
        currentTab: currentTabNum + 1
      });
    }
  },

  //视频是否隐藏
  showModelListener: function(e){
    this.setData({
      showvideo: !(e.detail.showModalStatus)
    });
  }
})