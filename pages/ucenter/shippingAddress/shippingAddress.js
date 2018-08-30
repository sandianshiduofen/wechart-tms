// pages/ucenter/shippingAddress/shippingAddress.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    seatchText: "",
    userId: "",
    noText: "loading..."
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const fromTo = options.from;
    if (fromTo) {
      this.setData({
        from: fromTo
      })
    }

    var _this = this;
    const info = app.globalData.userInfo;
    const setInfo = {
      id: info.id
    };

    _this.setData({
      userId: info.id
    })

    _this.getShopAddress(setInfo);

  },
  /**
   * 获取列表信息
   */
  getShopAddress: function (setInfo) {

    const userId = setInfo.id;
    const search = setInfo.searchText || "";

    wx.showLoading({
      title: '加载中',
    })
    const pathUrl = "/api/wx/address/find";
    const data = {
      userId: userId,
      type: 2,
      searchParam: search
    }

    const _this = this;
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        if (search) {
          _this.setData({
            noText: "没查到“" + search + "”的收货地址"
          })
        } else {
          _this.setData({
            noText: "您还没有添加收货地址"
          })
        }
        const info = data.info || {};
        // 为了编辑的时候传值
        info.map((v) => {
          const item = JSON.stringify(v);
          v['list'] = item;
        })
        _this.setData({
          list: info
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
   * 删除地址
   */
  delAddress: function (op) {
    const id = op.currentTarget.dataset.listId;
    const isDefault = op.currentTarget.dataset.isDefault||0;

    const _this = this;
    wx.showModal({
      content: '确定要删除吗？',
      confirmText: "删除",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          _this.delRequest(id, isDefault);
        }
      }
    });
  },
  /**
   * 删除请求数据
   */
  delRequest: function (id, isDefault) {
    wx.showLoading({
      title: '删除中',
    })
    const pathUrl = "/api/wx/address/delete";
    const data = {
      id: id,
      type: 2,
      userId: this.data.userId,
      isDefault: isDefault
    }
    const _this = this;
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        const listD = _this.data.list;

        for (let i = 0; i < listD.length; i++) {
          const addrId = listD[i].id;
          if (addrId == id) {
            listD.splice(i, 1);
            _this.setData({
              list: listD
            })
            wx.showToast({
              title: '删除成功',
              icon: 'none',
              duration: 2000
            })
          }
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

  /**
   * 搜索输入绑定
   */
  searchBind: function (event) {
    const searchKey = event.detail.value;
    this.setData({
      seatchText: searchKey
    })
  },
  /**
   * 点击筛选按钮
   */
  searchSubmit: function () {
    const searchText = this.data.seatchText;
    const userId = this.data.userId;

    const setInfo = {
      id: userId,
      searchText: searchText
    };
    this.getShopAddress(setInfo);
  },
  /**
   * 添加发货地址
   */
  addAddress: function () {
    wx.navigateTo({
      url: '../shippingDetails/shippingDetails',
    })

  },

  /**
   * 选择地址
   */
  chooseAddr: function (e) {
    const fromTo = this.data.from;
    if (fromTo) {
      const serial = e.currentTarget.dataset.index;
      const info = this.data.list[serial];
      info['receiverId'] = "";
      info['registerMobile']="";

      // 上页数据
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2]  //上一个页面
      prevPage.setData({
        receiver: info
      })

      wx.navigateBack({ changed: true });
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    if (this.data.from) {
      // 上页数据
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2]  //上一个页面
      
      const infoId = prevPage.data.receiver.id;
      const list = this.data.list;
      list.map((v) => {
        if (infoId == v.id) {
          prevPage.setData({
            receiver: v
          })
          return false;
        }
      })
    }
  }
})