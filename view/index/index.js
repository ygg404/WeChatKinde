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
    showModalStatus: false,
    showvideo: true,
    numQuery: '',
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
      banner_image: '../../image/k1.jpg'
    }, {
      banner_id: 1,
      banner_image: '../../image/k2.jpg'
    }, {
      banner_id: 2,
      banner_image: '../../image/k3.jpg'
    }, {
      banner_id: 1,
      banner_image: '../../image/k4.jpg'
    }],
    //类目
    category_list: [{
      category_id:  "../Tabs/Business/business",
      category_name: '主营业务',
      category_color: '#FFFFFF',
      category_image: '../../image/cp.png'
    }, {
      category_id: "../Tabs/Solution/solution",
      category_name: '解决方案',
      category_color: '#FFFFFF',
      category_image: '../../image/fan.png'
    }, {
      category_id: '../Tabs/News/news',
      category_name: '最新动态',
      category_color: '#FFFFFF',
      category_image: '../../image/new.png'
    }, {
      category_id: '../Tabs/Contact/contact',
      category_name: '联系我们',
      category_color: '#FFFFFF',
      category_image: '../../image/lx.png'
    }],
    //加载隐藏
    loadingHidden: true,
    //合作伙伴
    currentTab: 0,
    currentTabNum: 0,
    partner_list: [{
      partner_id: 0,
      partner_image: '../../image/partner1.jpg'
    }, {
      partner_id: 1,
      partner_image: '../../image/partner2.jpg'
    }, {
      partner_id: 2,
      partner_image: '../../image/partner3.jpg'
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

    try {
      var value = wx.getStorageSync('storage')
      if (value) {
        console.log(value);
        // Do something with return value
      }
    } catch (e) {
      // Do something when catch error
    }
    //获取前三条新闻
    this.AddNews(this);


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
        utils.TipModel('错误', '网络异常', 0)
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
      btnDisable: true
    });
    // var that = this;
    this.getToken(this);
  },

  /**
  * 获取Token
  */
  getToken: function (that) {
    if (that.data.isScan == false)
    {
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


    that.setData({
      loadingHidden: false,
      showvideo:false,
      isScan: false
    });
    wx.request({
      url: 'https://mini.kd315.net/api/Security/GetToken?staffId=kinde_mini' ,
      //data: 'code=kindetest&serialNo=' + this.data.antiFakeNo,    //参数为键值对字符串
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
          that.getImageInfo(that, SignToken);
        }else{
          utils.TipModel('错误', res.data.Info, 0);
          that.setData({
            loadingHidden: true,
            showvideo: true,
            btnDisable: false,
          }); 
        }

      },
      fail: function (res) {
        // fail
        console.log("fail:" + res.data);
        utils.TipModel('错误' , '网络异常' , 0);
        that.setData({
          loadingHidden: true,
          showvideo: true,
          btnDisable: false,
        }); 
         
      },
      complete: function () {
        // complete
      }
    })

  },

  getImageInfo: function (that, signToken) {
    var staffid = 'kinde_mini';
    var timestamp = Date.parse(new Date());
    var nonce = parseInt(2147483647 * Math.random());
    var query = 'serialNo' + that.data.numQuery;
    var sign = utils.getSign(signToken, timestamp, nonce, staffid, query, app.globalData.AppSecret);
    wx.request({
      url: 'https://mini.kd315.net/api/Security/Verify?b=' + that.data.numQuery,
      method: 'GET',
      // data: 'b=' + this.data.numQuery,    //参数为键值对字符串
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

        console.log(res.data);

        var eCount = res.data["Count"];
        var eFirstSearchTime = res.data["FirstSearchTime"];
        var eRandomCode = res.data["RandomCode"];
        var eTelCount = res.data["TelCount"];

        var eImage = res.data["ImageBase64"];
        var eResult = res.data["Result"];
        var eImgHeight = res.data["ImageHeight"];
        var eImgWidth = res.data["ImageWidth"];
        var eImgZoom = res.data["ImageZoom"];

        var eDescription = res.data["Description"];
        var eIsAuto = res.data["IsAuto"];

        if (eDescription == "<img  src='https://mini.kd315.net/Content/images/false.png'>") {
          wx.navigateTo({
            url: '../Error/error'
          });
        }
        else {
          wx.navigateTo({
            url: '../result/result?imageBase64Data=' + eImage +
            '&ImageHeight=' + eImgHeight + '&ImageZoom=' + eImgZoom
            + '&Description=' + Base64Parse.Base64.encode(eDescription)
            + '&IsAuto=' + eIsAuto + '&Result=' + eResult
            // +'&queryCount=' + eCount
            // + '&FirstSearchTime=' + eFirstSearchTime + '&TelCount=' + eTelCount 
          });
        }
      },
      complete:function(res){
        that.setData({
          btnDisable: false,
          loadingHidden: true,
          showvideo: true,
        });

      },

      fail: function (res) {

      }

    });
  },
  /*
  *获取防伪码
  */
  numInput: function (e) {
    this.setData({
      numQuery: e.detail.value
    });

  },

  recognizeCode: function () {
    //小程序API
    var that = this;
    wx.scanCode({
      //扫描条形码ISBN
      success: function (res) {
        var scanCode = res.result.substring(res.result.indexOf('=') + 1, res.result.length);
        // console.log('scanCode:'+scanCode);
        // console.log('resCode:' + res.result);

        that.setData({
          numQuery: scanCode,
          isScan: true
        });
        that.setData({
          btnDisable: true
        });
        // var that = this;
        that.getToken(that);

        // wx.navigateTo({
        //   url: '../outJoin/outJoin?UrlScan=' + res.result

        // });
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
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



  //左侧菜单
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
    animation.translateX(-240).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画：Y轴不偏移，停
      animation.translateX(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭抽屉
      if (currentStatu == "close") {
        this.setData(
          {
            showvideo: true,
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData(
        {
          showvideo: false,
          showModalStatus: true
        }
      );
    }
  }
  


})