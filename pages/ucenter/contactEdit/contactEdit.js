// pages/ucenter/contactEdit/contactEdit.js

const verify = require('../../../utils/verify.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number:"",
    userId:"",
    phone:"",
    code: "",
    codeText: "获取验证码",
    ifCode:true,
    id: "",
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const id = options.id||"";
    if (id){
      const phone = options.phone;
      const index = options.index;
      this.setData({
        phone: phone,
        id:id,
        index: index
      })
    }
    var _this = this;
    const info = app.globalData.userInfo;
    _this.setData({
      number: info.number,
      userId: info.id
    })
  },

  /**
   * 获取验证码
   */

  getcode:function(){
    const phone=this.data.phone;

    const _this = this;
    if (!_this.verify.isPhoneNo(phone)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (_this.data.ifCode) {
      _this.setData({
        codeText: "获取中...",
        ifCode: false
      })
      const pathUrl = "/api/wx/validation/getcode";
      let type = 6;
      
      const data = {
        phone: phone,
        type: 6
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
   * 保存电话
   */
  phoneSubmit: function () {
    var gCode = this.data.code;
    var phone = this.data.phone;
    var userId = this.data.userId;
    var number = this.data.number;
    var id = this.data.id;

    if (!gCode) {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!this.verify.istelverify(gCode)) {
      wx.showToast({
        title: '请输入正确的验证码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    const _this = this;
    var pathUrl="";
    if (id){
      pathUrl = "/api/wx/contacts/edit_v1";
    }else{
      pathUrl = "/api/wx/contacts/add_v1";
    }
    
    const data = {
      code: gCode,
      userId: userId,
      phone: phone,
      number: number,
      id:id
    }
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      console.log(d.data)
      const data = d.data;
      if (data.success) {
        console.log(data.info);
        const info=data.info;
        console.log(data);
        
        _this.goBack(info);
        wx.navigateBack({ changed: true });
      } else {
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
   * 上一页数据添加
   */

  goBack: function (info){
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]  //上一个页面

    var list = prevPage.data.list;
    var index = this.data.index;
    var id = this.data.id;
    
    if (id){
      list.splice(index, 1, info);
    }else{
      list.push(info);
    }
    prevPage.setData({
      list: list
    })
  },

  /**
   * 监控手机号
   */

  watchPhone: function (event) {
    this.setData({
      phone: event.detail.value
    })
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
   * 验证
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