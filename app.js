//app.js
const requrieApi = require('./utils/diffapi.js')
const wechat = require('./utils/wechat.js')

App({
  data:{
    
  },
  onLaunch: function () {
    // 聊天导航添加聊天标记
    wx.setTabBarBadge({
      index: 1,
      text: '1'
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    const _this=this;
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          // 登录请求
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          const pathUrl ="/api/wx/login/applogin";
          const datainfo = {
            code: res.code
          };
          return _this.requrieApi.wxApiApp(pathUrl, datainfo).then(function (d) {
            wx.hideLoading();
            const data = d.data;
            if (data.success) {
              _this.getUserStorage();
            } else {
              wx.showToast({
                title: data.message,
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
        
      }
    })
    
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  // 接口获取用户信息
  getUserStorage: function (callback) {
    const pathUrl = "/api/wx/login/finduser";
    const data = {
      id: 17  //五子
      // id: 461  //二五修理厂
      // id: 2
    }
    const _this = this;
    return _this.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      // console.log(data)
      if (data.success) {
        let setUserInfo = data.info || {};
        _this.globalData.userInfo = setUserInfo;
        if (_this.userInfoReadyCallback) {
          _this.userInfoReadyCallback(setUserInfo)
        }
        
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
  // getUser: function () {
  //   const _this=this;
  //   return new Promise((resolve) => {
  //     _this.wechat.getStorage('setUserInfo')
  //       .then(res => {
  //         // 有缓存，判断是否过期
  //         if (res.data) {
  //           return resolve(res.data)
  //         }
  //         // 已经过期
  //         console.log('uncached')
  //         return resolve(null)
  //       })
  //       .catch(e => resolve(null))
  //   })
  // },
  /**
   * 替换重置存储
   */
  updateInfo: function (key, val) {
    var _this = this;
    let info = this.globalData.userInfo || {}
    info[key] = val;
    this.globalData.userInfo = info;

    // _this.getUser()
    //   .then((d) => {
    //     let info = JSON.parse(d) || {}
    //     info[key] = val;

    //     const setUserInfo = JSON.stringify(info);
    //     _this.wechat.setStorage('setUserInfo', setUserInfo);
    //     console.log(setUserInfo)
    //   })
  },
  //存储用户信息
  globalData: {
    userInfo: null
  },
  // 获取接口调用
  requrieApi: requrieApi,
  // 获取信息存储信息
  wechat: wechat
})