// pages/ucenter/account/withdraw/withdraw.js
const app=getApp();
Page({
/**
 *
 *  extractAmount:0,//可提现金额
 *  bankOwned:"", //银行卡开户银行
 *  bankNo:"",  //银行卡账号
 *  takeMaxMoney:0, //最大取款金额takePoundageMoney
 *  takePoundageMoney:0,//手续费
 *  isTakePoundageMoney:false,
 *  withdrawPrice:'', //填写取款金额
 *  freeze:false,
 *  userId:"",  //用户id
 *  userAccount:"",//用户账户
 *  userName: "",//用户名电话
 *  userType:"",//用户类型
 *  showPayPwdInput: false,  //是否展示密码输入层
 *  pwdVal: '',  //输入的密码
 *  payFocus: true, //文本框焦点
 */
  /**
   * 页面的初始数据
   */
  data: {
    extractAmount:0,
    bankOwned:"",
    bankNo:"",
    takeMaxMoney:0,
    takePoundageMoney:0,
    isTakePoundageMoney:false,
    withdrawPrice:'',
    freeze:false,
    userId:"", 
    userAccount:"",
    userName: "",
    userType:"",
    showPayPwdInput: false,
    pwdVal: '',
    payFocus: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    const info = app.globalData.userInfo;
    _this.setData({
      userId: info.id,
      userAccount: info.account,
      userName: info.userName,
      userType: info.type
    })
    _this.cartInfo(info);
    this.maxPrice();
  },

  /**
   * 银行卡信息
   */
  cartInfo: function (info){
    const _this = this;
    const pathUrl = "/api/wx/account/bank/list";
    const data = {
      account: info.account
    }
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data || {};
      if (data.success) {
        const info = data.info;
        const extractAmount = info.extractAmount.toFixed(2) || 0.00;
        const bankOwned = info.bankOwned||"";
        let bankNo = info.bankNo;
        bankNo = bankNo.substr(0, 4) + '******' + bankNo.substr(bankNo.length - 4);
        _this.setData({
          extractAmount: extractAmount,
          bankOwned: bankOwned,
          bankNo: bankNo,
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
   * 最大提现金额
   */
  maxPrice:function(){
    const _this = this;
    const pathUrl = "/api/wx/account/findpoundage";
    const data = {}
    return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
      wx.hideLoading();
      const data = d.data || {};
      if (data.success) {
        const info = data.info;
        const takeMaxMoney = info.takeMaxMoney;
        const takePoundageMoney = info.takePoundageMoney.toFixed(2);
        _this.setData({
          takeMaxMoney: takeMaxMoney,
          takePoundageMoney: takePoundageMoney
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
   * 点击问号
   */
  question:function(){
    const takeMaxMoney = this.data.takeMaxMoney;
    let markedWords="";
    if (takeMaxMoney){
      markedWords = '单日可多次进行提现,要求每笔提现小于' + takeMaxMoney + '元'
    }else{
      markedWords ="不限制最大提现金额";
    }
    wx.showModal({
      showCancel: false,
      confirmText: "我知道了",
      content: markedWords
    })
  },
  /**
   * 金额输入
   */
  priceInput: function (event) {
    const withdrawPrice = parseFloat(event.detail.value);
    this.setData({
      withdrawPrice: withdrawPrice
    })
    if (this.data.takePoundageMoney > 0 && withdrawPrice>0){
      this.setData({
        isTakePoundageMoney: true
      })
    }else{
      this.setData({
        isTakePoundageMoney: false
      })
    }
  },
  /**
   * 验证是否输入的是金额
   */
  isverify:function (verify) {
    var pattern = /^\d{1,8}(\.\d{1,2})?$/;
    return pattern.test(verify);
  },

  /**
   * 判断账户是否封停
   */
  accountStop:function(){
    const _this = this;
    const pathUrl = "/api/wx/login/finduser";
    const data = {
      id: this.data.userId,
    }
    return new Promise(function(resolve){
      app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
        const data = d.data || {};
        if (data.success) {
          resolve(data.info);
          return false;
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 2000
          })
          return false;
        }
      }).catch(function (e) {
        console.log(e);
      })
    }) 
  },
  priceVerify: function () {
    const withdrawPrice = this.data.withdrawPrice;//填写取款金额
    const takePoundageMoney = this.data.takePoundageMoney;//手续费
    const extractAmount = this.data.extractAmount;//可提现金额
    const takeMaxMoney = this.data.takeMaxMoney;//最大取款金额
    if (!withdrawPrice) {
      wx.showToast({
        title: '提现金额必须大于0哦~',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!this.isverify(withdrawPrice)) {
      wx.showToast({
        title: '请输入正确的价格,小数点后不大于两位数',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    if (withdrawPrice <= takePoundageMoney) {
      wx.showToast({
        title: '提现金额必须大于手续费哦~',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    if (withdrawPrice > extractAmount) {
      wx.showToast({
        title: '提现金额不得大于可用余额',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (withdrawPrice > takeMaxMoney && takeMaxMoney>0) {
      wx.showToast({
        title: '每笔最大提现金额需小于' + takeMaxMoney + '元',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  },
  /**
   * 提现
   */
  withdrawSubmit: function () {
    var _this=this;
    if (this.priceVerify()) {
      _this.setData({ showPayPwdInput: true, payFocus: true });
      return false;
      return this.accountStop().then(function (d) {
        const data = d || {}
        console.log(data);
        // 判断是否冻结用户
        if (data.accountState == 1) {
          wx.showToast({
            title: "对不起，您的账户已被冻结，冻结原因：" + data.accountFreezeReason + "，如有疑问，请联系客服：4001-821200",
            icon: 'none',
            duration: 2000
          })
          return false;
        }

        _this.setData({ showPayPwdInput: true, payFocus: true });
      }) 
    }
  },

  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function () {

    var val = this.data.pwdVal;

    this.setData({ showPayPwdInput: false, payFocus: false, pwdVal: '' }, function () {
      // wx.showToast({
      //   title: val,
      // })
    });

  },
  /**
   * 获取焦点
   */
  getFocus: function () {
    this.setData({ payFocus: true });
  },
  /**
   * 输入密码监听
   */
  inputPwd: function (e) {
    this.setData({ pwdVal: e.detail.value });

    if (e.detail.value.length >= 6) {
      const password = e.detail.value;
      const _this = this;
      const pathUrl = "/api/withdraw/cash/apply";
      const userName = this.data.userName;
      const account = this.data.userAccount;
      const withdrawPrice = this.data.withdrawPrice;
      const userTypeNum = this.data.userType;
      let userType="";
      if (userTypeNum == 2) {
        var userType = 'JXS';
      } else if (userTypeNum == 1) {
        var userType = 'XLC';
      } else {
        var userType = 'PTYH';
      };

      const data = {
        loginAccount: userName,
        account: account,
        amount: withdrawPrice,
        password: password,
        userType: userType,
      }
      
      app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
        const data = d.data || {};
        if (data.success) {
          wx.redirectTo({
            url: '../withdrawSuccess/withdrawSuccess'
          })
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
      this.hidePayLayer();
    }
  }
})