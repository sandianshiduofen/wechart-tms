// pages/ucenter/account/telCode/telCode.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel:"",
    hideTel:"",
    code:"",
    codeText:"获取验证码",
    ifCode:true,
    find:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const find=options.find;
    console.log(find)
    if (find=="password"){
      this.setData({
        find: 'password'
      })
    }
    
    const _this = this;
    const info = app.globalData.userInfo;
    const tel = info.userName;
    const hideTel = _this.hideTel(tel);
    _this.setData({
      tel: tel,
      hideTel: hideTel
    })
    
  },

  /**
   * 电话隐藏
   */
  hideTel:function(tel){
    const phoneXing = tel.substr(0, 3) + '****' + tel.substr(7);
    return phoneXing;
  },

  /**
   * 监控输入验证码
   */
  watchCode: function (event){
    this.setData({
      code: event.detail.value
    })
  },

  /**
   * 获取验证码
   */
  gainCode:function(){
    const _this = this;
    if (_this.data.ifCode){
      _this.setData({
        codeText: "获取中...",
        ifCode:false
      })
      const pathUrl = "/api/wx/validation/getcode";
      let type= 2;
      const find=_this.data.find;
      
      if (find == 'password') {
        type = 3
      }
      console.log(find);
      const data = {
        phone: _this.data.tel,
        type: type,
      }
      return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
        wx.hideLoading();
        var countTime=60;
        var timer=setInterval(()=>{
          countTime--;
          _this.setData({
            codeText: countTime + "后再次获取",
          })
          if (countTime==0){
            clearInterval(timer);
            _this.setData({
              codeText: "获取验证码",
              ifCode: true
            })
          }
        },1000)
      }).catch(function (e) {
        _this.setData({
          codeText: "获取失败，再次获取",
          ifCode: true
        })
      })
    }
  },

  /**
   * 下一步，提交验证码
   */

  nextStep:function(){
    var gCode = this.data.code;
    if (!gCode){
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    console.log(this.istelverify(gCode))
    if (!this.istelverify(gCode)){
      wx.showToast({
        title: '请输入正确的验证码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    const _this = this;
    const pathUrl = "/api/wx/account/findverificationbycode";
    const find=_this.data.find;
    let type=2;
    if (find=='password'){
      type=3
    }
    const data = {
      code: gCode, 
      userName: _this.data.tel, 
      type: type,
    }
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      console.log(d.data)
      const data=d.data;
      if (data.success){
        if (find == 'password') {
          wx.redirectTo({
            url: '../setPassword/setPassword?edit=1'
          })
          return false;
        }

        wx.navigateTo({
          url: '../addBank/addBank'
        })

      }else{
        wx.showToast({
          title: data.message,
          icon: 'none',
          duration: 2000
        })
      }
      

    }).catch(function (e) {
      wx.showToast({
        title: '提交失败',
        icon: 'none',
        duration: 2000
      })
    })
  },

  /**
   * 验证验证码
   */
  istelverify:function(verify) {
    var pattern = /^\d{4,7}$/;
    return pattern.test(verify);
  },

})