// pages/ucenter/account/billing/billing.js
const app=getApp();
Page({
  /**
   * 页面的初始数据
   * accout /账户账号
   * currentData  //显示当前月份
   * incomeAmount //本月收入
   * expenditureAmount //本月支出
   * list//账户列表
   * lastDate// 当前最后一个时间---加载更多使用
   * arriveEnd  //加载到底部
   * filtrate  //过滤类型
   * filtrateType //过滤类型逗号分隔
   * filtrateTypeSearch 点击过滤确定当前过滤的类型 ，逗号分隔
   * filtrateDate{
   *  date//选中以后的数组
   *  endDate //空间结束不能大于当前时间
   *  currentDate //当前时间
   *  startDate //时间空间开始不能小于当前时间
   * }
   * dateCuo //点击过滤确定当前过滤的时间戳
   * filtrateShow //是否显示筛选浮层
   */
  data: {
    account:"",
    currentData:"当",
    incomeAmount:0.00,
    expenditureAmount:0.00,
    list:[],
    lastDate:'',
    arriveEnd:false,
    arriveEndText:"",
    filtrate: [
      { id: 4, value: '货款支付'},
      { id: 5, value: '报价单支付'},
      { id: 6, value: '提现' },
      { id: 3, value: '代收货款' },
    ],
    filtrateType: "",
    filtrateTypeSearch: "",
    filtrateDate:{
      date:"",
      endDate: "",
      currentDate:"",
      startDate:"1980-1-1"
    },
    dateCuo:"",
    filtrateShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    const info = app.globalData.userInfo;
    _this.setData({
      account: info.account
    })
    _this.showAccountList();
    _this.getCurrentDate();
  },
  /**
   * 上拉加载更多
   */
  onReachBottom:function(){
    var arriveEnd = this.data.arriveEnd;
    if (!arriveEnd){
      var filtrateTypeSearch = this.data.filtrateTypeSearch;
      var dateCuo = this.data.dateCuo;
      var lastDate = this.data.lastDate;
      const others = {
        types: filtrateTypeSearch,
        startTime: dateCuo,
        pageTime: lastDate
      }

      this.setData({
        arriveEndText: '加载中...',
      })
      this.showAccountList(others,'more');
    }
    
  },
  /**
   * 显示数据
   */
  showAccountList: function (others,push){
    const _this=this;
    const other = others||{};
    _this.setAccountList(other).then((d) => {
      console.log(d);
      var list=d.list;
      var incomeAmount = d.countInfo.incomeAmount;
      var expenditureAmount = d.countInfo.expenditureAmount;

      list.map((v)=>{
        var creatTime = v.createTime;
        v['showDate'] = this.showDataFun(creatTime, 'data')
        v['showTime'] = this.showDataFun(creatTime,'time')
      })

      var lastDate = ""

      if (list.length == 0) {
        _this.setData({
          arriveEnd: true,
          arriveEndText: '-- 没有更多数据 --',
        })
      } else {
        this.setData({
          arriveEndText: '',
        })
        lastDate = list[list.length - 1].createTime;
      }

      
      if (!push) {
        _this.setData({
          list: list,
          lastDate: lastDate,
          incomeAmount: incomeAmount,
          expenditureAmount: expenditureAmount
        })
        // console.log(_this.data.list)
        return false;
      }
      var listAll = _this.data.list;
      listAll = listAll.concat(list);
      _this.setData({
        list: listAll,
        lastDate: lastDate,
      })
      return false;
      
    });
  },
  setAccountList: function (other){
    const account = this.data.account;
    return this.getAccount(account, 10, other);
  },
  /*
   *获取列表数据 
   */
  getAccount: function (account, pageSize, other ){
    return new Promise((resolve)=>{
      const others = other||{};
      const _this = this;
      const pathUrl = "/api/account/wecat/payment/list";
      const data = {
        account: account,
        pageSize: pageSize,
        pageTime: others.pageTime,
        types: others.types,
        startTime: others.startTime,
      }
      return app.requrieApi.apiHaiLApp(pathUrl, data).then(function (d) {
        wx.hideLoading();
        const data = d.data || {};
        if (data.success) {
          const info = data.info;
          // console.log(info)
          resolve(info);
          // _this.setData({

          // })
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
   * 时间
   */
  bindDateChange: function (e) {
    this.data.filtrateDate.date = e.detail.value;
    this.setData({
      filtrateDate: this.data.filtrateDate
    })
  },
  /**
   * 获取当前时间
   */
  getCurrentDate: function () {
    const date = new Date();
    const myDate = date.getFullYear() + '-' + this.addZero((date.getMonth() + 1));
    this.data.filtrateDate.date = myDate;
    this.data.filtrateDate.currentDate = myDate; 
    this.data.filtrateDate.endDate = myDate;
    this.setData({
      filtrateDate: this.data.filtrateDate
    })
  },

  /**
   * 日期自动填0
   */
  addZero:function(va){
    if (va < 10){
      return '0' + va;
    }
    return va;
  },

  /**
   * 类别筛选
   */
  checkboxChange: function (e) {
    const filtrate = this.data.filtrate;
    const checkArr = e.detail.value;
    let filtrateType="";
    if (checkArr.length>0){
      for (var i = 0; i < filtrate.length; i++) {
        for (let j = 0; j < checkArr.length; j++) {
          if (filtrate[i].id == checkArr[j]) {
            filtrate[i].checked = true;
            break;
          }
          filtrate[i].checked = false;
        }
      }
    }else{
      for (var i = 0; i < filtrate.length; i++) {
          filtrate[i].checked = false;
      }
    }
    filtrateType = checkArr.join(',');
    
    this.setData({
      filtrate: filtrate,
      filtrateType: filtrateType
    })
  },
  /**
   * 重置
   */
  billFiltReset:function(){
    let filtrate = this.data.filtrate;
    for (let i = 0; i < filtrate.length;i++){
      filtrate[i].checked=false;
    }
    this.data.filtrateDate.date = this.data.filtrateDate.currentDate;
    this.setData({
      filtrate: filtrate,
      filtrateDate: this.data.filtrateDate,
    })
  },
  /**
   * 筛选
   */
  accountDetailSearch:function(){
    const filtrateType = this.data.filtrateType;
    const time = this.data.filtrateDate.date;
    const timeArr=time.split('-');
    const year = timeArr[0];
    const month = timeArr[1];
    const date = this.transformDateChuo(year, month,'1','00','00','00');
    

    // 当前时间
    let nowDay = this.data.filtrateDate.currentDate;
    nowDay = nowDay.split('-');
    const currentYear = nowDay[0];
    const currentMonth = nowDay[1];

    let numHan = "";

    if (currentYear == year){
      if (currentMonth==month){
        numHan="当"
      }else{
        numHan = month;
      }
    }else{
      numHan = year + "年" + month
    }


    
    this.setData({
      filtrateTypeSearch: filtrateType,
      dateCuo: date,
      arriveEndText: '加载中...',
      arriveEnd: false,
      lastDate: "",
      currentData: numHan
    })

    var filtrateTypeSearch = this.data.filtrateTypeSearch;
    var dateCuo = this.data.dateCuo;
    var lastDate = this.data.lastDate;
    const others = {
      types: filtrateType,
      startTime: date,
      pageTime:""
    }
    
    this.showAccountList(others);

    this.closeFiltrate();
  },
  /**
   * 将年月日转化为字符串
   */
  transformDateChuo: function (year, month, day, hours, minutes, seconds){
    var date = new Date(year + '-' + month + '-' + day + ' ' + hours+':' + minutes+':'+seconds);

    var time1 = date.getTime();
    return time1;
  },
  /**
   * 将时间戳转化为年月日
   */
  timestampToTime:function (timestamp) {
    // timestampToTime(1403058804);
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y + M + D + h + m + s;
  },
  /**
   * 分别转化为日期，时间
   */
  showDataFun: function (timestamp,type){
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M = this.addZero(date.getMonth() + 1);
    var D = this.addZero(date.getDate());
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    
    // 当前时间
    const curDate = new Date();
    const myYear = curDate.getFullYear();
    const myMonth = this.addZero((curDate.getMonth() + 1));
    const myDate = curDate.getDate();

    if (myYear == Y && myMonth == M && myDate == D && type == "data"){
      return '今天';
    }
    if (type=="data"){
      return M +'-'+ D;
    }

    if (type == "time") {
      return h + ':' + m;
    }
  },
  /**
   * 关闭筛选
   */
  closeFiltrate: function () {
    this.setData({
      filtrateShow: false
    })
  },
  /**
   * 打开筛选
   */
  openFiltrate: function () {
    this.setData({
      filtrateShow: true
    })
  }

})