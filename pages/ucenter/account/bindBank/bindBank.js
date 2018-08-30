// pages/ucenter/account/bindBank/bindBank.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:"",
    bankNo:"",
    bankOwned:"",
    cardtype:"",
    showPayPwdInput:"",
    pwdVal:"",
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
    _this.getBindBank(info);
  },

  /**
   * 获取银行卡信息
   */
  getBindBank:function(info){
    const _this = this;
    const pathUrl = "/api/wx/account/bank/list";
    const data = {
      account: info.account
    }
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data || {};
      if (data.success) {
        const info = data.info;
        const cardNum = info.bankNo;
        const bankOwned = info.bankOwned;
        const cardtype = info.cardtype;
        const cardNumLen = cardNum.length;
        let xing = cardNum.substr(0, 4);
        for (var i = 4; i < cardNumLen - 4; i++) {
          xing += '*';
        };
        var phoneXing = xing + cardNum.substr(cardNumLen - 4);
        _this.setData({
          bankOwned: bankOwned,
          cardtype: cardtype,
          bankNo: phoneXing
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
   * 更换银行卡
   */
  changeBank:function(){
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
      // console.log(password)
      // return false;
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
            url: '../addBank/addBank?edit=1'
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
})