// pages/ucenter/myqr/myqr.js
// var QR = require("../../../utils/qrcode.js");
var QRCode = require('../../../utils/weapp-qrcode.js')

var qrcode;

//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    company:"",
    userName:"",
    account:"",
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUser();
  },
  /**
   * 获取用户信息
   */
  getUser:function(){
    const _this = this;
    const info = app.globalData.userInfo;
    const company = info.company || "";
    const userName = info.userName || "";
    const account = info.account || "";
    console.log(info)
    _this.setData({
      company: company,
      userName: userName,
      account: account
    })

    var initUrl = this.data.account;

    qrcode = new QRCode('canvas', {
      text: initUrl,
      width: 160,
      height: 160,
      colorDark: "#000",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });
  },

})


