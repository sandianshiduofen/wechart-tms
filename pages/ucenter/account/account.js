// pages/ucenter/account/account.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    extractAmount: 0.00,
    guardAmount: 0.00,
    sumAmount: 0.00,
    bankNo: true,
    bankNoUrl:"./telCode/telCode",
    password: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    const info = app.globalData.userInfo;
    _this.getAccount(info);
  },
  /**
   * 获取账户信息
   */
  getAccount: function (info){
    const _this = this;
    const pathUrl = "/api/wx/account/bank/list";
    const data = {
      account: info.account
    }
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data||{};
      const info = data.info||{};
      const extractAmount = info.extractAmount.toFixed(2)||0.00;
      const guardAmount = info.guardAmount.toFixed(2) || 0.00;
      const sumAmount = info.sumAmount.toFixed(2) || 0.00;
      let bankNo = false;
      let password = false;
      let bankNoUrl = "./telCode/telCode";
      if (info.bankNo)
      {
        bankNo = true
        bankNoUrl = "./bindBank/bindBank"
      }
      if (info.password){
        password = true 
      }
      if (data.success) {
        _this.setData({
          extractAmount: extractAmount,
          guardAmount: guardAmount,
          sumAmount: sumAmount,
          bankNo: bankNo,
          bankNoUrl: bankNoUrl,
          password: password
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
   * 说明
   */
  explainBtn:function(){
    wx.showModal({
      showCancel: false,
      confirmText: "我知道了",
      content: '1、可提现金额：可通过“提现”功能，提现到银行卡的金额。\r\n 2、保护期金额：订单已签收，系统分账金额等待银行结算中，结算后即成为可用金额 \r\n 3、总金额：可提现金额+保护期金额=总金额'
    })
  },
  /**
   * 提现
   */
  withdrawDeposit:function(){
    if (!this.data.bankNo){
      wx.showModal({
        content: '您还未添加银行卡，前往设置',
        confirmText: "去设置",
        cancelText: "取消",
        success: function (res) {
          console.log(res);
          if (res.confirm) {
            wx.navigateTo({
              url: './telCode/telCode'
            })
          }
        }
      });
      return false;
    }
    wx.navigateTo({
      url: './withdraw/withdraw'
    })
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
    // wx.navigateBack({
    //   delta: 1
    // })
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