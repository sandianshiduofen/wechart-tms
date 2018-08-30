// pages/order/selfHelp/selfHelp.js
const verify=require("../../../utils/verify.js")
const app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    no:"",
    status:0,
    userId:"",
    userName:"",
    sender: {
      type: 1,
      id: "",
      company: "",
      contact: "",
      phone: "",
      proName: "",
      proNumber: "",
      cityName: "",
      cityNumber: "",
      areaName: "",
      areaNumber: "",
      detailed: "",
      lat: "",
      lng: "",
      isDefault: 0
    },
    receiver: {
      type: 2,
      id: "",
      company: "",
      contact: "",
      phone: "",
      proName: "",
      proNumber: "",
      cityName: "",
      cityNumber: "",
      areaName: "",
      areaNumber: "",
      detailed: "",
      lat: "",
      lng: "",
      isDefault: 0,
      registerMobile:"",//收货筛选电话
      receiverId:""
    },

    goodsName:"",
    
    goodsQuantity:1,

    goodsAmount:"",

    inputDotId:"",

    bannceList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const no = options.no;

    if (no){
      this.setData({
        no:no
      });
      this.getEditInfo(no);
    }

    var _this = this;
    
    let info = app.globalData.userInfo;
    if (!info) {
      app.userInfoReadyCallback = function () {

        info = app.globalData.userInfo;

        _this.setData({
          userName: info.userName,
          userId: info.number
        })
        _this.senderDefault(info.id)

      }
    } else {
      _this.setData({
        userName: info.userName,
        userId: info.number
      })
      _this.senderDefault(info.id)
    }


  },

  /**
   * 编辑时获取信息
   */
  getEditInfo:function(no){

    wx.showLoading({
      title: '加载中...',
    })

    const _this = this;
    const pathUrl = "/api/wx/waybill/getWaybill";
    const data = {
      waybillNo: no
    }
    return app.requrieApi.wxApiAnApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data || {};
      if (data.success) {
        const info = data.info;
        console.log(info);
        const dataInfo={
          status: info.status,

          sender: {
            company: info.senderName,
            contact: info.senderLinkman,
            phone: info.senderMobile,
            proName: info.senderProvinceName,
            proNumber: info.senderProvinceId,
            cityName: info.senderCityName,
            cityNumber: info.senderCityId,
            areaName: info.senderAreaName,
            areaNumber: info.senderAreaId,
            detailed: info.senderAddress,
            isDefault: 0
          },
          receiver: {
            company: info.receiverName,
            contact: info.receiverLinkman,
            phone: info.receiverMobile,
            proName: info.receiverProvinceName,
            proNumber: info.receiverProvinceId,
            cityName: info.receiverCityName,
            cityNumber: info.receiverCityId,
            areaName: info.receiverAreaName,
            areaNumber: info.receiverAreaId,
            detailed: info.receiverAddress,
          },

          goodsName: info.goodsName,

          goodsQuantity: info.goodsQuantity,

          goodsAmount: info.goodsAmount,

          inputDotId: info.inputDotId,
        }
        _this.setData(dataInfo);
        // 如果状态等于0，根据收发地址获取揽货网点
        if (info.status==0){
          _this.bannce(info.senderCityId, info.senderAreaId, info.receiverAreaId, info.inputDotId)
        }else{
          //如果状态大于0，根据订单获取揽货网点
          _this.bannceEdit(info.inputDotId);
        }
        
        console.log(_this.data)
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
        title: '订单信息获取失败',
        icon: 'none',
        duration: 2000
      })
    })
  },
  /**
   * 加载默认发货地址
   */
  senderDefault: function (userId){
    wx.showLoading({
      title: '加载中...',
    })
    const pathUrl = "/api/wx/address/find";
    
    const data = {
      type: 1, 
      userId: userId,
    }
    const _this = this;
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        const info = data.info || {};
        _this.setData({
          sender: info[0]
        })
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none',
          duration: 3000
        })
      }

    }).catch(function (e) {
      console.log(e);
    })
  },

  /**
   * 编辑发货地址
   */
  senderEdit: function (e) {
    const senderName = this.data.sender.company;
    if (!senderName){
      wx.navigateTo({
        url: '../deliveryDetails/deliveryDetails',
      })
    }else{
      const info = JSON.stringify(this.data.sender);
      wx.navigateTo({
        url: '../deliveryDetails/deliveryDetails?edit=' + info
      })
    }
  },

  /**
   * 编辑收货地址
   */
  receiverEdit: function (e) {
    const receiverName = this.data.receiver.company;
    if (!receiverName) {
      wx.navigateTo({
        url: '../shippingDetails/shippingDetails',
      })
    } else {
      const info = JSON.stringify(this.data.receiver);
      wx.navigateTo({
        url: '../shippingDetails/shippingDetails?edit=' + info
      })
    }
  },

  /**
   * 发货地址地址薄选择
   */
  senderBook: function (e) {
    wx.navigateTo({
      url: '../../ucenter/deliveryAddress/deliveryAddress?from=helpSelf',
    })
  },

  /**
   * 收货地址地址薄选择
   */
  receiverBook: function (e) {
    wx.navigateTo({
      url: '../../ucenter/shippingAddress/shippingAddress?from=helpSelf',
    })
  },

  /**
   * 网点选择
   */
  radioChange: function (e) {
    const num=e.detail.value;
    let list = this.data.bannceList;
    list.map((v)=>{
      if (v.id == num){
        v['checked'] ="checked";
      }else{
        v['checked'] = "";
      }
    })

    this.setData({
      bannceList:list,
      inputDotId: num
    })
  },

  /**
   * 填写货物信息
   */
  goodsNameInput:function(e){
    let goodsName = e.detail.value;
    goodsName = goodsName.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\-\_\=\+\#\|\*\+\.\。\、\？\/\!\！]/g, '')
    this.setData({
      goodsName: goodsName
    })
  },

  /**
   * 减少包裹数量
   */
  goodsQuantityReduce:function(){
    let goodsQuantity=this.data.goodsQuantity;
    goodsQuantity--;
    this.setData({
      goodsQuantity: goodsQuantity
    })
  },

  /**
   * 增加包裹数量
   */
  goodsQuantityIncrease: function () {
    let goodsQuantity = this.data.goodsQuantity;
    goodsQuantity++;
    this.setData({
      goodsQuantity: goodsQuantity
    })
  },

  /**
   * 包裹数量变化
   */

  goodsQuantityInteger:function(e){
    let goodsQuantity = e.detail.value;
    goodsQuantity = parseInt(goodsQuantity);
    this.setData({
      goodsQuantity: goodsQuantity
    })
  },

  /**
   * 代收货款变化
   */
  collectionDelivery:function(e){
    let goodsAmount = e.detail.value;
    this.setData({
      goodsAmount: goodsAmount
    })
  },
  
  /**
   * 失去焦点为空时，数量默认为1；
   */
  goodsQuantityOne:function(e){
    let goodsQuantity = e.detail.value;
    if (!goodsQuantity || goodsQuantity<1){
      goodsQuantity = 1;
      wx.showToast({
        title: '包裹数量必须大于等于1',
        icon: 'none',
        duration: 3000
      })
      this.setData({
        goodsQuantity: goodsQuantity
      })
      return false;
    }
    if (goodsQuantity>999){
      goodsQuantity = 999;
      wx.showToast({
        title: '包裹数量值最大为999',
        icon: 'none',
        duration: 3000
      })
      this.setData({
        goodsQuantity: goodsQuantity
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.status==0){
      const cityNumber = this.data.sender.cityNumber
      const areaNumber = this.data.sender.areaNumber
      const receiverAreaId = this.data.receiver.areaNumber

      if (areaNumber && receiverAreaId) {
        this.bannce(cityNumber, areaNumber, receiverAreaId);
      }
    }
  },

  /**
   * 拨打电话
   */
  callPhone: function (options) {
    const tel = options.currentTarget.dataset.tel;
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
   * 查询网点
   */
  bannce: function (cityNum, areaNum, receiverAreaId,num){
    wx.showLoading({
      title: '加载中...',
    })
    const numOrder = num||"";
    const pathUrl = "/api/wx/dot/getListByArea";
    const cityId = cityNum;
    const areaId = areaNum;
    const data = {
      cityId: cityId,
      areaId: areaId,
      receiverAreaId: receiverAreaId
    }
    const _this = this;
    return app.requrieApi.wxApiAnApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        const info = data.info || {};
        if (numOrder){
          info.map((v) => {
            if (v.id == numOrder) {
              v['checked'] = "checked";
            }
          })
        }
        _this.setData({
          bannceList:info
        })
        if (info.length==0){
          wx.showToast({
            title: '未检索到揽货网点',
            icon: 'none',
            duration: 3000
          })
        }
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none',
          duration: 3000
        })
      }

    }).catch(function (e) {
      console.log(e);
    })
  },

  /**
   * 获取某个网点信息
   */

  bannceEdit:function(id){
    wx.showLoading({
      title: '加载中...',
    })
    let pathUrl = "/api/wx/dot/getDotById";
    const data = {
      dotId: id
    }
    const _this = this;
    return app.requrieApi.wxApiAnApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data;
      if (data.success) {
        let info = data.info || {};
        info.checked='checked';
        const dot = [info];
        _this.setData({
          bannceList: dot
        })
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none',
          duration: 3000
        })
      }

    }).catch(function (e) {
      console.log(e);
    })
  },

  /**
   * 提交运单验证
   */

  submitVerify:function(){
    const data=this.data;
    const senderCompany = data.sender.company;
    const receiverCompany = data.receiver.company;
    const goodsName = data.goodsName;
    const goodsQuantity = data.goodsQuantity;
    const goodsAmount = parseFloat(data.goodsAmount);
    const inputDotId = data.inputDotId;
    // 发货地址不能为空
    if (!senderCompany) {
      wx.showToast({
        title: '请选择发货地址',
        icon: 'none',
        duration: 3000
      })
      return false;
    }
    // 收货地址不能为空
    if (!receiverCompany) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 3000
      })
      return false;
    }
    // 货物信息不能为空
    if (!goodsName) {
      wx.showToast({
        title: '请填写货物信息',
        icon: 'none',
        duration: 3000
      })
      return false;
    }
    // 包裹数量不能为空
    if (!goodsQuantity) {
      wx.showToast({
        title: '请填写包裹数量',
        icon: 'none',
        duration: 3000
      })
      return false;
    }
    // 代收货款只能是0或者大于两元
    if (goodsAmount > 0 && goodsAmount < 2) {
      wx.showToast({
        title: '代收货款必须为0或者大于2元',
        icon: 'none',
        duration: 3000
      })
      return false;
    }

    // 代收货款只能是0或者大于两元
    if (goodsAmount >= 1000000) {
      wx.showToast({
        title: '输入的代收货款需小于100万',
        icon: 'none',
        duration: 3000
      })
      return false;
    }
    
    // 代收货款金额只能输入数字和小数点，切小数点后最多保留两位小数！例：88.88
    if ((goodsAmount > 0)&&!(verify.isPirce(goodsAmount))) {
      wx.showModal({
        content: '代收货款金额只能输入数字和小数点，切小数点后最多保留两位小数！例：88.88',
        showCancel: false,
        success: function (res) {}
      });
      return false;
    }
    
    // 揽货网点不能为空
    if (!inputDotId) {
      wx.showToast({
        title: '请选择揽货网点',
        icon: 'none',
        duration: 3000
      })
      return false;
    }
    return true;
  },

  /**
   * 提交运单
   */
  orderSubmit:function(){
    if (this.submitVerify()){
      const data=this.data;
      const dataInfo={
        no:data.no,
        waybillNo:data.no,
        waybillSource:1,

        senderId: data.userId,
        senderRegisterMobile: data.userName,

        senderAddId: data.sender.id,
        senderAddIsDf: data.sender.isDefault,
        senderName: data.sender.company,
        senderLinkman: data.sender.contact,
        senderMobile: data.sender.phone,
        senderProvinceName: data.sender.proName,
        senderCityName: data.sender.cityName,
        senderAreaName: data.sender.areaName,
        senderProvinceId: data.sender.proNumber,
        senderCityId: data.sender.cityNumber,
        senderAreaId: data.sender.areaNumber,
        senderAddress: data.sender.detailed,

        receiverName: data.receiver.company,
        receiverLinkman: data.receiver.contact,
        receiverMobile: data.receiver.phone,
        receiverProvinceName: data.receiver.proName,
        receiverCityName: data.receiver.cityName,
        receiverAreaName: data.receiver.areaName,
        receiverProvinceId: data.receiver.proNumber,
        receiverCityId: data.receiver.cityNumber,
        receiverAreaId: data.receiver.areaNumber,
        receiverAddress: data.receiver.detailed,

        receiverRegisterMobile: data.receiver.registerMobile,
        receiverId: data.receiver.receiverId,

        goodsName: data.goodsName,

        goodsQuantity: data.goodsQuantity,

        goodsAmount: data.goodsAmount,

        inputDotId: data.inputDotId,
      }

      wx.showLoading({
        title: '下单中...',
      })
      let pathUrl ="/api/wx/waybill/insertWaybill";
      if (data.no){
        pathUrl = "/api/wx/waybill/editWaybill";
      }
      if (data.status>0){
        pathUrl = "/api/wx/waybill/editWaybillGoodsAmount";
      }
      
      const _this = this;
      return app.requrieApi.wxApiAnApp(pathUrl, dataInfo).then(function (d) {
        wx.hideLoading();
        const data = d.data;
        if (data.success) {
          const info = data.info || {};
          wx.redirectTo({
            url: '../orderSuccess/orderSuccess?no=' + info,
          })
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 3000
          })
        }

      }).catch(function (e) {
        console.log(e);
      })
    }
  }
})