// pages/order/paymentList/paymentList.js
const app=getApp();

const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const no = options.no;
    this.getInfo(no);
  },

  /**
   * 获取代收货款信息
   */
  getInfo: function (waybillNo){
    const _this = this;

    wx.showLoading({
      title: '加载中',
    })
    
    const pathUrl = "/api/wx/waybill/findBillChangeRecordForWX";

    const data = {
      waybillNo: waybillNo
    }

    return app.requrieApi.wxApiAnApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data || {};
      if (data.success) {
        let info = data.info;
        info.map((i)=>{
          const CTime = _this.util.showDataFun(i.createTime, 'YMDhms');
          i['CTime']=CTime;
        })
        console.log(info)

        _this.setData({
          list:info
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