// pages/order/takeDelivery/takeDelivery.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    UserNumber:"",
    filtrate: [
      {
        text: "待揽货",
        id: 0
      },
      {
        text: "已揽货",
        id: 1
      },
      {
        text: "运输中",
        id: 2
      },
      {
        text: "配送中",
        id: 3
      },
      {
        text: "已签收",
        id: 6
      },
      {
        text: "取消发货",
        id: 4
      },
      {
        text: "已退货",
        id: 5
      },
      {
        text: "已驳回",
        id: 7
      }
    ],
    arriveEnd:false,
    arriveEndText:"",
    noText:"",
    currentPage:1,
    filtrateType: "",
    filtrateTypeSearch:"",
    filtrateText: [],
    filtrateTextTrue:[],
    filtrateShow:false,
    filtrateDate:{
      filtrateStart:"",
      filtrateEnd:"",
      endDate:"",
      currentDate:""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this=this;

    wx.showLoading({
      title: '加载中',
    })

    let info = app.globalData.userInfo;
    if (!info) {
      app.userInfoReadyCallback = function () {
        info = app.globalData.userInfo;
        _this.setData({
          UserNumber: info.number
        })
        _this.getOrderList(info.number).then((info) => {
          _this.showList(info)
        });
      }
    } else {
      _this.setData({
        UserNumber: info.number
      })
      _this.getOrderList(info.number).then((info) => {
        _this.showList(info)
      });
    }

    this.getCurrentDate();
  },

  /**
   * 获取用户编号
   */
  getOrderNumber: function (other,type){
    const others = other ? other : {};
    const types = type ? type:"";
    const number = this.data.UserNumber;
    const _this=this;

    return _this.getOrderList(number, others).then((info) => {
      _this.showList(info, types)
    });
  },

  /**
   * 获取列表
   */
  getOrderList: function (number, param){
    return new Promise((resolve) => {
      const others = param || {};

      const _this = this;
      const pathUrl = "/api/wx/waybill/selectWaybillForSender";

      const currentPage = others.currentPage || 1;
      const types = others.types || "";
      const startTime = others.startTime || "";
      const endTime = others.endTime || "";
      const data = {
        senderId: number,
        pageSize: 15,
        currentPage: currentPage,
      }
      if (types){
        data['status'] = types;
      }
      if (startTime && endTime){
        data['startTime'] = startTime;
        data['endTime'] = endTime;
      }

      return app.requrieApi.wxApiAnApp(pathUrl, data).then(function (d) {
        wx.hideLoading();
        const data = d.data || {};
        if (data.success) {
          const info = data.info;
          resolve(info);
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
   * 数据显示
   */
  showList:function(info,append){
    const list = info.list;
    const appends = append||"";
    if (!list && !append) {
      this.setData({
        list: [],
        noText: '没有您要查询的内容',
      })
      return false;
    }else{
      this.setData({
        noText: '',
      })
    }
    if (!list && append) {
      this.setData({
        arriveEnd: true,
        arriveEndText: '没有更多数据',
      })
      return false;
    }else{
      this.setData({
        arriveEndText: '',
      })
    }
    if (append){
      let listAll=this.data.list;
      listAll = listAll.concat(list);
      this.setData({
        list: listAll
      })

    }else{
      this.setData({
        list: list
      })
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh:function(){
    var currentPage = 1;
    var filtrateTypeSearch = this.data.filtrateTypeSearch;
    var filtrateStart = this.data.filtrateDate.filtrateStart || "";
    var filtrateEnd = this.data.filtrateDate.filtrateEnd || "";
    const others = {
      currentPage: currentPage,
      types: filtrateTypeSearch,
      startTime: filtrateStart,
      endTime: filtrateEnd
    }

    this.setData({
      arriveEndText: '加载中...',
      currentPage: currentPage
    })
    this.getOrderNumber(others).then(()=>{
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 上拉加载更多
   */
  onReachBottom: function () {
    var arriveEnd = this.data.arriveEnd;
    if (!arriveEnd) {
      var currentPage = parseInt(this.data.currentPage) + 1;
      var filtrateTypeSearch = this.data.filtrateTypeSearch;
      var filtrateStart = this.data.filtrateDate.filtrateStart || "";
      var filtrateEnd = this.data.filtrateDate.filtrateEnd||"";
      const others = {
        currentPage: currentPage,
        types: filtrateTypeSearch,
        startTime: filtrateStart,
        endTime: filtrateEnd
      }

      this.setData({
        arriveEndText: '加载中...',
        currentPage: currentPage
      })
      this.getOrderNumber(others, 'more');
    }
  },

  /**
   * 类别筛选
   */
  checkboxChange: function (e) {
    const filtrate = this.data.filtrate;
    const checkArr = e.detail.value;
    let filtrateType = "";
    let filtrateText=[];
    // console.log(e)

    if (checkArr.length > 0) {
      for (var i = 0; i < filtrate.length; i++) {
        for (let j = 0; j < checkArr.length; j++) {
          if (filtrate[i].id == checkArr[j]) {
            filtrate[i].checked = true;
            filtrateText.push(filtrate[i]);
            break;
          }
          filtrate[i].checked = false;
        }
      }
    } else {
      for (var i = 0; i < filtrate.length; i++) {
        filtrate[i].checked = false;
        filtrateText=[];
      }
    }
    filtrateType = checkArr.join(',');

    this.setData({
      filtrate: filtrate,
      filtrateType: filtrateType,
      filtrateText: filtrateText
    })
  },

  /**
   * 获取当前时间
   */
  getCurrentDate: function () {
    const date = new Date();
    const myDate = date.getFullYear() + '-' + this.addZero((date.getMonth() + 1))+ '-' + this.addZero(date.getDate());
    // this.data.filtrateDate.date = myDate;
    this.data.filtrateDate.currentDate = myDate;
    this.data.filtrateDate.endDate = myDate;
    this.setData({
      filtrateDate: this.data.filtrateDate
    })
  },

  /**
   * 日期自动填0
   */
  addZero: function (va) {
    if (va < 10) {
      return '0' + va;
    }
    return va;
  },

  /**
   * 开始时间变化
   */
  bindStartChange: function (e) {
    this.data.filtrateDate.filtrateStart = e.detail.value;
    this.setData({
      filtrateDate: this.data.filtrateDate
    })
  },
  /**
   * 结束时间变化
   */
  bindEndChange: function (e) {
    this.data.filtrateDate.filtrateEnd = e.detail.value;
    this.setData({
      filtrateDate: this.data.filtrateDate
    })
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
  },

  /**
   * 重置
   */
  billFiltReset: function () {
    let filtrate = this.data.filtrate;
    for (let i = 0; i < filtrate.length; i++) {
      filtrate[i].checked = false;
    }
    this.data.filtrateDate.filtrateStart = "";
    this.data.filtrateDate.filtrateEnd = "";
    this.setData({
      filtrate: filtrate,
      filtrateDate: this.data.filtrateDate,
      filtrateType:"",
      filtrateText:""
    })
  },
  /**
   * 筛选
   */
  accountDetailSearch: function () {
    const filtrateType = this.data.filtrateType;

    const timeStart = this.data.filtrateDate.filtrateStart;
    const timeEnd = this.data.filtrateDate.filtrateEnd;
    const timeArrStart = timeStart.split('-');
    const timeArrEnd = timeEnd.split('-');
    const yearStart = timeArrStart[0];
    const monthStart = timeArrStart[1];
    const dayStart = timeArrStart[2];
    const yearEnd = timeArrEnd[0];
    const monthEnd = timeArrEnd[1];
    const dayEnd = timeArrEnd[2];
    const dateStart = timeStart? this.transformDateChuo(yearStart, monthStart, dayStart, '00', '00', '00'):"";
    const dateEnd = timeEnd? this.transformDateChuo(yearEnd, monthEnd, dayEnd, '23', '59', '59'):"";

    this.setData({
      filtrateTypeSearch: filtrateType,
      dateCuoStart: dateStart,
      dateCuoEnd: dateEnd,
      arriveEndText: '加载中...',
      arriveEnd: false,
      currentPage: 1,
      filtrateTextTrue: this.data.filtrateText,
    })

    // console.log(this.data)

    const others = {
      types: filtrateType,
      startTime: dateStart,
      endTime: dateEnd,
      currentPage: 1
    }


    this.setData({
      arriveEndText: '加载中...',
      currentPage: 1
    })
    this.getOrderNumber(others);


    // this.showAccountList(others);

    this.closeFiltrate();
  },

  /**
   * 将年月日转化为字符串
   */
  transformDateChuo: function (year, month, day, hours, minutes, seconds) {
    var date = new Date(year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds);

    var time1 = date.getTime();
    return time1;
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
  }
})
