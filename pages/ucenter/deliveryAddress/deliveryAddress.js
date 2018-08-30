// pages/ucenter/deliveryAddress/deliveryAddress.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    seatchText:"",
    userId:"",
    noText:"loading...",
    from:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const fromTo = options.from;
    if (fromTo){
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
    const search = setInfo.searchText||"";
    
    wx.showLoading({
      title: '加载中',
    })
    const pathUrl = "/api/wx/address/find";
    const data = {
      userId: userId,
      type: 1,
      searchParam: search
    }

    const _this = this;
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        if (search) {
          _this.setData({
            noText: "没查到“" + search + "”的发货地址"
          })
        } else {
          _this.setData({
            noText: "您还没有添加发货地址"
          })
        }
        const info = data.info || {};
        // 为了编辑的时候传值
        info.map((v)=>{
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
  delAddress:function(op){
    const id = op.currentTarget.dataset.listId;
    const isDefault = op.currentTarget.dataset.isDefault;

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
  delRequest: function (id, isDefault){
    wx.showLoading({
      title: '删除中',
    })
    const pathUrl = "/api/wx/address/delete";
    const data = {
      id: id,
      type: 1,
      userId: this.data.userId,
      isDefault: isDefault
    }
    const _this = this;
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        const listD=_this.data.list;
        
        for (let i = 0; i < listD.length;i++){
          const addrId = listD[i].id;
          if (addrId==id){
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
   * 设为默认
   */

  setDefault: function (options){
    const id = options.currentTarget.dataset.listId;
    wx.showLoading({
      title: '设置中...',
    })
    const pathUrl = "/api/wx/sender/setdefault";
    const data = {
      id: id,
      userId: this.data.userId
    }
    const _this = this;
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        const listD = _this.data.list;
        // 更改默认
        for (let i = 0; i < listD.length; i++) {
          const addrId = listD[i].id;
          if (addrId == id) {
            let listS = listD[i].list;
            listS = JSON.parse(listS);
            listS.isDefault=1;
            listD[i].list = JSON.stringify(listS);
            listD[i].isDefault=1;
          }else{
            let listS = listD[i].list;
            listS = JSON.parse(listS);
            listS.isDefault = 0;
            listD[i].list = JSON.stringify(listS);
            listD[i].isDefault = 0;
          }

          _this.setData({
            list: listD
          })
        }

        wx.showToast({
          title: '设置成功',
          icon: 'none',
          duration: 2000
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
   * 搜索输入绑定
   */
  searchBind: function (event){
    const searchKey = event.detail.value;
    this.setData({
      seatchText: searchKey
    })
  },

  /**
   * 点击筛选按钮
   */
  searchSubmit:function(){
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
  addAddress:function(){
    wx.navigateTo({
      url: '../deliveryDetails/deliveryDetails',
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

      // 上页数据
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2]  //上一个页面
      prevPage.setData({
        sender: info
      })

      wx.navigateBack({ changed: true });
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.from){
      // 上页数据
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2]  //上一个页面
      // prevPage.setData({
      //   sender: info
      // })

      const infoId = prevPage.data.sender.id;
      const list = this.data.list;
      list.map((v) => {
        if (infoId == v.id) {
          prevPage.setData({
            sender: v
          })
          return false;
        }
      })
    }
  }
})