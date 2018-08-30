// pages/ucenter/account/addBank/addBank.js
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:false,
    bankName:"",
    bankNo: "",
    bankType:"",
    isBankType:false,
    edit:false,
    type:"",
    account:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const edit = options.edit||"";
    if (edit){
      var _this = this;
      const info = app.globalData.userInfo;
      _this.setData({
        edit: true,
        type: info.type,
        account:info.account
      })
    }
    
    console.log(this.data.edit)
  },
  
  /**
   * 银行卡名字输入
   */
  bankNameInput: function (event) {
    this.setData({
      bankName: event.detail.value
    })
  },
  /**
   * 银行卡号输入
   */
  bankNoInput: function (event) {
    var bankNoValue = event.detail.value;
    this.setData({
      bankNo: bankNoValue
    })
    if (bankNoValue.length>=16){
      const _this = this;
      this.getType(bankNoValue);
    }else{
      this.setData({
        bankType: "",
        isBankType: false
      })
    }
  },
  /**
   * 获取类型
   */
  getType: function (bankNoValue){
    var _this=this;
    const pathUrl = "/api/wx/account/ownedbank/list";
    const data = {
      bank: bankNoValue
    }
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      const data = d.data;
      if (data.success) {
        var info = data.info;
        if (info) {
          _this.setData({
            bankType: info.bankname,
            isBankType: true
          })
          return false;
        }
        _this.setData({
          bankType: '未找到银行卡类型',
          isBankType: false
        })
        return false;
      }
    }).catch(function (e) {
      _this.setData({
        bankType: '未找到银行卡类型',
        isBankType: false
      })
    })
  },

  /**
   * 勾选协议
   */
  checkboxChange:function(event){
    var deal = event.detail.value;
    if (deal.length>0){
      this.setData({
        checked: true
      })
      return false;
    }
    this.setData({
      checked: false
    })
  },
  /**
   * 下一步
   */
  nextStep: function () {
    if (this.submitVerify()) {
      if(!this.data.edit){
        var bankName = this.data.bankName;
        var bankNo = this.data.bankNo;
        var bankType = this.data.bankType;
        wx.navigateTo({
          url: `../setPassword/setPassword?bankName=${bankName}&bankNo=${bankNo}&bankType=${bankType}`
        })
        return false;
      }
      this.editBink().then((d)=>{
        wx.redirectTo({
          url: `../changeSuccess/changeSuccess`
        })
      })
      
      
    }
  },
  /**
   * 提交验证
   */
  submitVerify:function(){
    var bankName = this.data.bankName;
    var bankNo = this.data.bankNo;
    var bankType = this.data.bankType;
    var isBankType = this.data.isBankType;
    var checked = this.data.checked;
    if (!bankName) {
      wx.showToast({
        title: '请填写开户人姓名',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!bankNo) {
      wx.showToast({
        title: '请填写银行卡号',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (bankNo.length < 16) {
      wx.showToast({
        title: '请填写正确的银行卡号',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!isBankType) {
      wx.showToast({
        title: '请填写正确的银行卡号',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!checked) {
      wx.showToast({
        title: '请阅读并同意《银行卡支付用户协议》',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  },
  /**
   * 提交绑定
   */
  editBink: function () {
    const _this = this;
    return new Promise((resolve)=>{
      const pathUrl = "/api/wx/account/bank/edit";
      const account = _this.data.account;
      const type = _this.data.type;
      const bankName = _this.data.bankName;
      const bankNo = _this.data.bankNo;
      const bankType = _this.data.bankType;

      const data = {
        role: type,
        account: account,
        bankNo: bankNo,
        bankName: bankName,
        bankOwned: bankType
      }
      console.log(data);

      app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
        const data = d.data || {};
        if (data.success) {
          resolve(data)
        } else {
          wx.showModal({
            showCancel: false,
            confirmText: "我知道了",
            content: data.message
          })
        }
      }).catch(function (e) {
        console.log(e);
      })
    })
  }
})