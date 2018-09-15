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
  },
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  }
})