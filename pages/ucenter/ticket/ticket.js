// pages/ucenter/ticket/ticket.js
const app=getApp();
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    noText:"没有物流券"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  //   var _this = this;
  //   app.getUser()
  //     .then((d) => {
  //       var info = JSON.parse(d) || {}
  //       _this.ticketList(info.id);
  //     })
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    const info = app.globalData.userInfo;
    _this.ticketList(info.id);
    // app.getUser()
    //   .then((d) => {
    //     var info = JSON.parse(d) || {}
    //     _this.ticketList(info.id);
    //   })
  },
  /**
   * 获取物流券列表
   */
  ticketList: function (userId){
    wx.showLoading({
      title: '加载中',
    })
    const pathUrl = "/api/platform/coupon/list";
    const data = {
      userId: userId
    }
    const _this = this;
    return app.requrieApi.wxApiZhaoApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        const info = data.info || {};

        info.map(function(v){
          v['startTimeShow'] = _this.util.showDataFun(v.startDate,'YMD');
          v['endTimeShow'] = _this.util.showDataFun(v.endDate,'YMD');
        });
        _this.setData({ 
          list: info
        })
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none',
          duration: 2000
        })
      }

    }).catch(function (e) {
      console.log(e);
    })
  },
  showQr:function(event){
    const tickedid = event.currentTarget.dataset.tickedid;
    const amount = event.currentTarget.dataset.amount;
    wx.navigateTo({
      url: './ticketQr/ticketQr?tickedid='+tickedid+'&amount='+amount,
    })
  },
  /**
   * 时间转换
   */
  util: util,

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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