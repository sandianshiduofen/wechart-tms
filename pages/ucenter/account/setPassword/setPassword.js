// pages/ucenter/account/setPassword/setPassword.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankType:"",
    bankNo:"",
    bankType:"",
    password: "",
    repeatPassword:"",
    account:"",
    edit:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const edit = options.edit;
    const bankName = options.bankName;
    const bankNo = options.bankNo;
    const bankType = options.bankType;
    const _this=this;
    const info = app.globalData.userInfo;
    _this.data.account = info.account;
    
    if (edit) {
      this.setData({
        edit: true
      })
      return false;
    }
    if (bankName && bankNo && bankType) {
      this.setData({
        bankName: bankName,
        bankNo: bankNo,
        bankType: bankType
      })
      return false;
    }
  },

  /**
   * 密码提交
   */
  passwordSubmit: function () {
    const edit = this.data.edit;
    
    if (this.passwordVerify()){
      if (!edit){
        this.addPassword();
        return false;
      }
      this.editPassword();
    }
  },
  /**
   * 添加密码
   */
  addPassword:function(){

    const password = this.data.password;
    const cardName = this.data.bankName;
    const bankNo = this.data.bankNo;
    const bankOwned = this.data.bankType;
    const account = this.data.account;
    const _this = this;
    const pathUrl = "/api/wx/account/passwordandbank/add";
    const data = {
      role: 3,
      account: account,
      bankNo: bankNo,
      bankName: cardName,
      bankOwned: bankOwned,
      password: password,
    }

    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        wx.navigateTo({
          url: `../bankSuccess/bankSuccess`
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
   * 设置密码
   */
  editPassword: function () {
    const password = this.data.password;
    const account = this.data.account;
    const _this = this;
    const pathUrl = "/api/wx/account/password/edit";
    const data = {
      account: account,
      password: password,
    }

    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        wx.redirectTo({
          url: `../bankSuccess/bankSuccess?text=password`
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
   * 验证
   */
  passwordVerify:function(){
    var onePassword = this.data.password;
    var repeatPassword = this.data.repeatPassword;
    if (!onePassword) {
      wx.showToast({
        title: '新密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!this.isPswPay(onePassword)) {
      wx.showToast({
        title: '请输入六位纯数字的密码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!repeatPassword) {
      wx.showToast({
        title: '重复密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (onePassword != repeatPassword) {
      wx.showToast({
        title: '新密码与重复密码不一致',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  },

  /**
   * 密码验证六位数字
   */
  isPswPay: function (psw) {
    var pattern = /^\d{6}$/;
    return pattern.test(psw);
  },

  /**
   * 输入密码
   */
  onePsw: function (event) {
    const password = event.detail.value;
    this.setData({
      password: password
    })
  },
  /**
   * 重复密码
   */
  repeatPsw: function (event) {
    const password = event.detail.value;
    this.setData({
      repeatPassword: password
    })
  },

})