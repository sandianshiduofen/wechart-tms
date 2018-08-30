// pages/order/serviceStation/serviceStation.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dot:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    var id = options.id;
    this.getDot(id)
  },

  /**
   * 获取网点信息
   */
  getDot: function (dotId){
    const _this = this;

    wx.showLoading({
      title: '加载中',
    })
    
    const pathUrl = "/api/wx/dot/getDotById";
    const data = {
      dotId: dotId
    }
    return app.requrieApi.wxApiAnApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data || {};
      if (data.success) {
        const info = data.info;
        console.log(info);

        _this.setData({
          dot: info
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
      wx.showToast({
        title: '网点获取失败',
        icon: 'none',
        duration: 2000
      })
    })
  },

  /**
   * 拨打电话
   */
  callPhone:function(options){
    const tel=options.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel,
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