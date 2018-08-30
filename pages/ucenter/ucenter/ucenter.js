//index.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    company:"",
    userName: "",
    headUrl:"../../../sources/images/headimg.png",
    companyTel: 4001821200,
    infoList:[
      {
        iconUrl:"../../../sources/images/ucenter8.png",
        listName:"我的账户",
        navUel:"../account/account",
        isArrow:true,
        explain:"可提现金额￥25.25",
      },
      {
        iconUrl: "../../../sources/images/ucenter8.png",
        listName: "我的券包",
        navUel: "../ticket/ticket",
        isArrow: true,
        explain: "",
      },
      {
        iconUrl: "../../../sources/images/ucenter8.png",
        listName: "发货地址薄",
        navUel: "../deliveryAddress/deliveryAddress",
        isArrow: true,
        explain: "",
      },
      {
        iconUrl: "../../../sources/images/ucenter8.png",
        listName: "收货地址薄",
        navUel: "../shippingAddress/shippingAddress",
        isArrow: true,
        explain: "",
      },
      {
        iconUrl: "../../../sources/images/ucenter8.png",
        listName: "常用收货电话",
        navUel: "../contactNumber/contactNumber",
        isArrow: true,
        explain: "",
      },
      {
        iconUrl: "../../../sources/images/ucenter8.png",
        listName: "安全管理",
        navUel: "../resetPassword/resetPassword",
        isArrow: true,
        explain: "",
      },
      {
        iconUrl: "../../../sources/images/ucenter8.png",
        listName: "微信绑定",
        isArrow: true,
        clickEvent: 'unbindWx',
        explain: "解绑",
      },
      {
        iconUrl: "../../../sources/images/ucenter8.png",
        listName: "客服电话:4001821200",
        isArrow: false,
        clickEvent: 'ringUp',
        explain: "",
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const _this=this;
    let info = app.globalData.userInfo;
    if (!info){
      app.userInfoReadyCallback = function () {
        info = app.globalData.userInfo;
        console.log(info)
        _this.getUserContent(info);
        _this.getAccount(info);
      }
    }else{
      _this.getUserContent(info);
      _this.getAccount(info);
    }
    
  },
  onShow: function () {
    // this.onLoad();
  },

  /**
   * 解绑
   */
  unbindWx: function () {
    const _this=this;
    wx.showModal({
      title: '解除绑定',
      content: '您确定要解除与该微信的绑定吗？',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          console.log('解绑')
          _this.unbindWxGet();
        }
      }
    });
  },

  /**
   * 解绑获取接口
   */
  unbindWxGet:function(){
    var _this = this;

    wx.showLoading({
      title: '解绑中...',
    })
    app.getUser()
      .then((d) => {
        var info = JSON.parse(d) || {}
        console.log(info, info.unionid)

        const pathUrl = "/api/wx/login/unboundwechat";
        const unionid = info.unionid;
        const data = {
          unionid: unionid
        }
        const _this = this;
        return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
          wx.hideLoading();
          const data = d.data;
          if (data.success) {
            const info = data.info || {};
            console.log(info);
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
      })
  },
  
  /**
   * 拨打电话
   */
  ringUp: function () {
    const tel = this.data.companyTel;
    console.log(tel)
    wx.makePhoneCall({
      phoneNumber: tel, //此号码并非真实电话号码，仅用于测试
      success: function () {
        wx.showToast({
          title: '拨打电话成功',
          icon: 'none',
          duration: 2000
        })
      },
      fail: function () {
        wx.showToast({
          title: '拨打电话失败！',
          icon: 'none',
          duration: 2000
        })
      }
    })

  },

  /**
   * 下拉
   */
  onPullDownRefresh: function () {
    app.getUser();
    wx.stopPullDownRefresh()
  },

  /**
   * 获取用户信息
   */
  getUserContent: function (info){
    wx.showLoading({
      title: '加载中',
    })
    const pathUrl = "/api/wx/login/finduser";
    const data = {
      id: info.id
    }
    const _this = this;
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        const info=data.info||{};
        const company = data.info.company;
        const userName = data.info.userName;
        const path=app.requrieApi.api.imgShowApi
        const headUrl = (path+data.info.headUrl) || "../../../sources/images/headimg.png";
        _this.setData({ company: company, userName:userName, headUrl: headUrl})
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
   * 获取账户信息
   */
  getAccount: function (info){
    const _this = this;
    const pathUrl = "/api/wx/account/bank/list";
    const data = {
      account:info.account
    }
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        _this.data.infoList[0].explain = "可提现金额￥" + data.info.extractAmount.toFixed(2);
        _this.setData({ infoList: _this.data.infoList })
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
})
