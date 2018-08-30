// pages/ucenter/ticketQr/ticketQr.js
const app = getApp();

var QRCode = require('../../../../utils/weapp-qrcode.js')

var qrcode;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"",
    amount: "",
    tickedid:"",
    countDown: 20,

    setInter: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const tickedid = options.tickedid;
    const amount = options.amount;

    this.setData({
      tickedid: tickedid,
      amount: amount
    })

    this.setQr(tickedid);
    this.countDownNum();
  },
  setQr: function (ticked) {
    var _this = this;
    const tickedid = ticked || _this.data.tickedid
    const info = app.globalData.userInfo;
    _this.getQr(tickedid, info.id);
  },
  /**
   * 获取数据以及二维码
   */
  getQr: function (tickedid, userId) {
    wx.showLoading({
      title: '加载中',
    })
    const _this = this;
    const pathUrl = "/api/platform/coupon/getno";
    const data = {
      userId: userId,
      id: tickedid
    }
    return app.requrieApi.wxApiZhaoApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        const info = data.info || {};
        _this.createQr(info)

        _this.setData({
          text: info,
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
   * 生成二维码
   */
  createQr:function(con){
    const text = con || this.data.text;
    qrcode = new QRCode('canvas', {
      text: text,
      width: 160,
      height: 160,
      colorDark: "#000",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });
    
  },
  countDownNum:function(){
    const _this=this;
    let i=20;
    this.data.setInter = setInterval(function(){
      i--;
      _this.setData({
        countDown: i        
      })
      if (i<=0){
        i=20;
        _this.setQr();
      }
    },1000);
  },
  onUnload:function(){
    clearTimeout(this.data.setInter);
  }
})