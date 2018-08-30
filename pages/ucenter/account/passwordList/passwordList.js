// pages/ucenter/account/passwordList/passwordList.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPayPwdInput: "",
    pwdVal: "",
    payFocus: true, //文本框焦点
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    const info = app.globalData.userInfo;
    _this.setData({
      account: info.account
    })
  },

  /**
   * 修改支付密码密码输入
   */
  editPassword:function(){
    var _this = this;
    _this.setData({ showPayPwdInput: true, payFocus: true });
  },
  /**
   * 输入密码监听
   */
  inputPwd: function (e) {
    this.setData({ pwdVal: e.detail.value });

    if (e.detail.value.length >= 6) {
      const password = e.detail.value;
      const _this = this;
      const pathUrl = "/api/wx/account/findaccountbypassword";
      const account = this.data.account;
      const data = {
        account: account,
        password: password
      }
      console.log(data);

      app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
        const data = d.data || {};
        if (data.success) {
          console.log(data)
          wx.navigateTo({
            url: '../setPassword/setPassword?edit=1'
          })
        } else {
          wx.showModal({
            showCancel: false,
            confirmText: "我知道了",
            content: data.message
          })
        }
      }).catch(function (e) {
        console.log(e);
      })
      this.hidePayLayer();
    }
  },

  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function () {

    var val = this.data.pwdVal;

    this.setData({ showPayPwdInput: false, payFocus: false, pwdVal: '' }, function () {
      // wx.showToast({
      //   title: val,
      // })
    });

  },
  /**
   * 获取焦点
   */
  getFocus: function () {
    this.setData({ payFocus: true });
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
  
  }
})