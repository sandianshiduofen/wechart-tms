// pages/order/waybillDetails/waybillDetails.js
const app = getApp();
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    waybillNo:"",
    content:{},
    logistics:[],
    dot:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const waybillNo = options.no;
    this.setData({
      waybillNo: waybillNo
    })
    const _this = this;
    this.getOrder(waybillNo);
    this.getWaybill(waybillNo);
  },

  /**
   * 获取订单信息
   */

  getOrder:function (waybillNo) {

    wx.showLoading({
      title: '加载中',
    })

    const _this = this;
    const pathUrl = "/api/wx/waybill/getWaybill";
    const data = {
      waybillNo: waybillNo
    }
    return app.requrieApi.wxApiAnApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data || {};
      if (data.success) {
        const info = data.info;
        console.log(info);
        let content = info;
        let creatTime = info.inputDate;
        creatTime = _this.util.showDataFun(creatTime, 'YMDhms');
        content['creatTime'] = creatTime;
        _this.setData({
          content: content
        })
        _this.getDot(content.inputDotId)
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(function (e) {
      console.log(e);
      wx.showToast({
        title: '订单信息获取失败',
        icon: 'none',
        duration: 2000
      })
    })
  },

  /**
   * 获取物流信息
   */
  getWaybill: function (waybillNo) {

    wx.showLoading({
      title: '加载中',
    })
    const _this = this;
    const pathUrl = "/api/wx/waybill/getWaybillLog";

    const data = {
      waybillNo: waybillNo
    }
    return app.requrieApi.wxApiAnApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data || {};
      console.log(data);
      if (data.success) {
        const info = data.info;
        console.log(info);

        let logistics = info;
        logistics.map((i)=>{
          let logTime = _this.util.showDataFun(i.logdate, 'YMDhms');
          i['logTime'] = logTime;
        })
        
        _this.setData({
          logistics: logistics
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
      wx.showToast({
        title: '订单物流信息获取失败',
        icon: 'none',
        duration: 2000
      })
    })
  },

  /**
   * 获取网点信息
   */
  getDot: function (dotId) {

    wx.showLoading({
      title: '加载中',
    })
    
    const _this = this;
    const pathUrl = "/api/wx/dot/getDotById";
    const data = {
      dotId: dotId
    }
    return app.requrieApi.wxApiAnApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data || {};
      if (data.success) {
        const info = data.info;
        console.log(info);

        _this.setData({
          dot: info
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
      wx.showToast({
        title: '订单信息获取失败',
        icon: 'none',
        duration: 2000
      })
    })
  }, 

  
  /**
   * 拨打电话
   */
  callPhone:function(options){
    const tel=options.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel,
      success: function () {
        wx.showToast({
          title: '拨打电话成功',
          icon: 'none',
          duration: 2000
        })
      },
      fail: function () {
        wx.showToast({
          title: '拨打电话失败！',
          icon: 'none',
          duration: 2000
        })
      }
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