// pages/order/customerFile/customerFile.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerNumber:0,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let phone=options.tel;
    // phone=13501209112;

    var _this = this;
    const info = app.globalData.userInfo;
    _this.customerSearch(phone, info.cityNumber, info.areaNumber);
    
  },

  /**
   * 检索客户档案
   */

  customerSearch: function (phone, cityNum,areaNum){
    wx.showLoading({
      title: '加载中...',
    })
    const pathUrl = "/api/wx/guest/list/search";
    const tel = phone;
    const cityId = cityNum;
    const areaId = areaNum;
    const data = {
      tel: tel, 
      cityId: cityId,
      areaId: areaId
    }
    const _this = this;
    return app.requrieApi.wxApiAnApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        const info = data.info || {};
        _this.setData({
          list: info,
          customerNumber:info.length
        })
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
  },
  
  /**
   * 选择客户档案
   */
  chooseCustomer:function(e){
    const index = e.currentTarget.dataset.index;
    console.log(index);
    const info = this.data.list[index];
    console.log(info);

    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]  //上一个页面

    prevPage.setData({
      type: 2,
      company: info.guestName,
      contact: info.linkman,
      phone: info.tel,
      proName: info.provinceName,
      proNumber: info.provinceId,
      cityName: info.cityName,
      cityNumber: info.cityId,
      areaName: info.areaName,
      areaNumber: info.areaId,
      detailed: info.address,
      areaInfo: info.provinceName + " " + info.cityName + " " + info.areaName,
      areaChoose:"",
      registerMobile: info.registerMobile,
      receiverId: info.guestNo
    })

    wx.navigateBack({ changed: true });
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