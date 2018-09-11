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
    Content: ''
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
          WxParse.wxParse('Description', 'html', res.data.Data.Content, that, 5);
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

  /**
 * 左侧菜单
 */
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

            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData(
        {

          showModalStatus: true
        }
      );
    }
  }
})