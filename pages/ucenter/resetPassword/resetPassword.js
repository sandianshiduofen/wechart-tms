// pages/ucenter/resetPassword/resetPassword.js
const verify = require('../../../utils/verify.js')
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    hidePhone:"",
    password:"",
    repeatPassword:"",
    codeText:"获取验证码",
    ifCode:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    const info = app.globalData.userInfo;
    const phone = info.userName;
    const hidePhone = _this.hideTel(phone);
    _this.setData({
      phone: phone,
      hidePhone: hidePhone
    })
  },

  /**
   * 电话隐藏
   */
  hideTel: function (tel) {
    const phoneXing = tel.substr(0, 3) + '****' + tel.substr(7);
    return phoneXing;
  },


  /**
   * 获取验证码
   */
  getCode: function () {
    const _this = this;
    if (_this.data.ifCode) {
      _this.setData({
        codeText: "获取中...",
        ifCode: false
      })
      const pathUrl = "/api/wx/validation/getcode";

      const data = {
        phone: _this.data.phone,
        type: 1,
      }
      return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
        wx.hideLoading();
        var countTime = 60;
        var timer = setInterval(() => {
          countTime--;
          _this.setData({
            codeText: countTime + "后再次获取",
          })
          if (countTime == 0) {
            clearInterval(timer);
            _this.setData({
              codeText: "获取验证码",
              ifCode: true
            })
          }
        }, 1000)
      }).catch(function (e) {
        _this.setData({
          codeText: "获取失败，再次获取",
          ifCode: true
        })
      })
    }
  },

  /**
     * 监控输入验证码
     */
  watchCode: function (event) {
    this.setData({
      code: event.detail.value
    })
  },

  /**
   * 监控输入密码
   */
  passwordBind: function (event) {
    const password = event.detail.value;
    this.setData({
      password: password
    })
  },
  /**
   * 监控重复密码
   */
  resetPasswordBind: function (event) {
    const password = event.detail.value;
    this.setData({
      repeatPassword: password
    })
  },

  /**
   * 验证
   */
  passwordVerify: function () {
    var code = this.data.code;
    var onePassword = this.data.password;
    var repeatPassword = this.data.repeatPassword;

    if (!code) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!this.verify.istelverify(code)) {
      wx.showToast({
        title: '请输入正确的验证码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    if (!code) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    if (!onePassword) {
      wx.showToast({
        title: '新密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!this.verify.ispsw(onePassword)) {
      wx.showToast({
        title: '请输入6-16位数字和字母的密码',
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
   * 提交密码
   */
  passwordSubmit:function(){
    if (this.passwordVerify()) {
      const password=this.data.password;
      const code=this.data.code;
      const phone=this.data.phone;

      const pathUrl = "/api/wx/login/pwforget";
      const data = {
        phone: phone,
        code: code,
        newPwd: password,
      }

      return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
        wx.hideLoading();
        const data = d.data;
        if (data.success) {
          wx.showModal({
            content: '密码重置成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({ changed: true });
              }
            }
          });
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
    }
  },

  /**
   * 正则验证
   */
  verify:verify,

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