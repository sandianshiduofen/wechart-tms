// pages/ucenter/contactNumber/contactNumber.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    const info = app.globalData.userInfo;
    _this.getList(info.id);
  },

  /**
   * 获取列表
   */
  getList: function (userId){
    wx.showLoading({
      title: '加载中',
    })
    const pathUrl = "/api/wx/contacts/list";
    const data = {
      userId: userId
    }
    const _this = this;
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        const info = data.info || {};
        console.log(info)
        _this.setData({
            list:info
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
   * 删除常用联系人
   */
  delPhone: function (options) {
    const id = options.currentTarget.dataset.listId;
    const userNumber = options.currentTarget.dataset.number;
    const indexU = options.currentTarget.dataset.index;
    const _this=this;
    wx.showModal({
      content: '确定要删除吗',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          _this.delData(id, userNumber, indexU)
        }
      }
    });
  },
  /**
   * 删除数据操作
   */

  delData: function (id, userNumber, indexU){
    wx.showLoading({
      title: '删除中...',
    })
    const pathUrl = "/api/wx/contacts/delete";
    const data = {
      id: id,
      number: userNumber
    }
    const _this = this;
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        const info = data.info || {};
        console.log(info)
        let list = _this.data.list;
        list.splice(indexU, 1);
        _this.setData({
          list: list
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
   * 编辑联系人
   */

  // editPhone:function(option){
  //   const id=option.
  // },

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