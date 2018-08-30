// pages/ucenter/shippingDetails/shippingDetails.js
const verify = require('../../../utils/verify.js')
const amapFile = require('../../../utils/amap-wx.js')
const address = require('../../../utils/city.js')
const app = getApp();
let animation
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isEdit: false,
    userId: "",
    id: "",
    company: "",
    contact: "",
    phone: "",
    detailed: "",
    lat: "",
    lng: "",
    isDefault: 0,

    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],

    areaInfo: "选择省、市、区",
    areaNum: "",
    areaChoose: 'cccc',

    registerMobile:"",
    receiverId:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let editInfo = options.edit || "";
    if (editInfo) {
      wx.setNavigationBarTitle({
        title: '编辑收货地址' //页面标题为路由参数
      })
      editInfo = JSON.parse(editInfo);
      console.log(editInfo)

      for (let i in editInfo) {
        this.setData({
          [i]: editInfo[i]
        })
      }

      this.setData({
        areaInfo: editInfo.proName + ' ' + editInfo.cityName + ' ' + editInfo.areaName,
        areaNum: editInfo.proNumber + ' ' + editInfo.cityNumber + ' ' + editInfo.areaNumber,
        areaChoose: "",
        isEdit: true
      })
      console.log(this.data)
    } else {
      var _this = this;
      const info = app.globalData.userInfo;
      _this.setData({
        userId: info.id
      })
    }


    this.getCity();
  },
  /**
   * 搜索客户档案
   */
  searchCustomer:function(){
    const phone = this.data.phone;

    // 联系电话不能为空
    if (!phone) {
      wx.showToast({
        title: '联系电话不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    // 联系电话为2-12位数字
    if (!this.verify.isNumberTel(phone)) {
      wx.showToast({
        title: '请输入正确纯数字的手机号或固话',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    wx.navigateTo({
      url: '../customerFile/customerFile?tel=' + phone,
    })
  },
  /**
   * 获取城市初始化
   */
  getCity: function () {
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
  },

  /**
   * 填写公司名称
   */
  companyBind: function (event) {
    const company = event.detail.value;
    this.setData({
      company: company
    })

  },


  /**
   * 填写联系人
   */
  contactBind: function (event) {
    const contact = event.detail.value;
    this.setData({
      contact: contact
    })
  },


  /**
   * 填写电话
   */
  phoneBind: function (event) {
    const phone = event.detail.value;
    this.setData({
      phone: phone
    })
  },


  /**
   * 填写详细地址
   */
  detailedBind: function (event) {
    const detailed = event.detail.value;
    this.setData({
      detailed: detailed
    })
  },
  /**
   * 城市选择
   */

  /**
   * 验证
   */
  verify: verify,
  selectDistrict: function (e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ' ' + that.data.citys[value[1]].name + ' ' + that.data.areas[value[2]].name;
    var areaNum = that.data.provinces[value[0]].id + ' ' + that.data.citys[value[1]].id + ' ' + that.data.areas[value[2]].id
    that.setData({
      areaInfo: areaInfo,
      areaNum: areaNum,
      areaChoose: '',
      proName: that.data.provinces[value[0]].name,
      cityName: that.data.citys[value[1]].name,
      areaName: that.data.areas[value[2]].name,
      proNumber: that.data.provinces[value[0]].id,
      cityNumber: that.data.citys[value[1]].id,
      areaNumber: that.data.areas[value[2]].id
    })
  },
  hideCitySelected: function (e) {
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
  },
  /**
   * 获取经纬度
   */
  getLagLon: function (area, detailed) {
    wx.showLoading({
      title: '添加中...',
    })
    const _this = this;
    return new Promise((resolve, reject) => {
      var myAmapFun = new amapFile.AMapWX({ key: 'c4cf95739ac706838a76691a38f2a623' });
      myAmapFun.getPoiAround({
        querykeywords: area + '' + detailed,
        success: function (data) {
          wx.hideLoading();
          const markersData = data.markers;
          if (markersData.length > 0) {
            const latitude = markersData[0].latitude;
            const longitude = markersData[0].longitude;
            _this.setData({
              lat: latitude,
              lng: longitude
            })
            resolve();
          } else {
            myAmapFun.getPoiAround({
              querykeywords: area,
              success: function (data) {
                const markersData = data.markers;
                if (markersData.length > 0) {
                  const latitude = markersData[0].latitude;
                  const longitude = markersData[0].longitude;
                  _this.setData({
                    lat: latitude,
                    lng: longitude
                  })
                  resolve();
                } else {
                  wx.showModal({ title: '没有获取到地理位置' })
                }

              },
              fail: function (info) {
                wx.showModal({ title: info.errMsg })
              }
            })
          }
        },
        fail: function (info) {
          wx.hideLoading();
          wx.showModal({ title: info.errMsg })
        }
      })
    })
  },
  /**
   * 提交网络获取
   */
  submitData: function () {
    const data = this.data;
    const aeraArr = data.areaInfo.split(' ');
    const aeraNumArr = data.areaNum.split(' ');
    const datainfo = {
      userId: data.userId,
      type: 2,
      id: data.id,
      company: data.company,
      contact: data.contact,
      phone: data.phone,
      proName: aeraArr[0],
      proNumber: aeraNumArr[0],
      cityName: aeraArr[1],
      cityNumber: aeraNumArr[1],
      areaName: aeraArr[2],
      areaNumber: aeraNumArr[2],
      detailed: data.detailed,
      lat: data.lat,
      lng: data.lng,
      isDefault: data.isDefault,
      registerMobile: data.registerMobile,
      receiverId: data.receiverId
    };
    console.log(datainfo);

    this.goback(datainfo);
    wx.navigateBack({ changed: true });

    // wx.showLoading({
    //   title: '上传中...',
    // })
    // let pathUrl = "";
    // if (data.isEdit) {
    //   pathUrl = "/api/wx/address/edit";
    // } else {
    //   pathUrl = "/api/wx/address/add";
    // }

    // const _this = this;
    // return app.requrieApi.wxApiApp(pathUrl, datainfo).then(function (d) {
    //   wx.hideLoading();
    //   const data = d.data;
    //   if (data.success) {
    //     console.log(data)
    //     _this.goback(data.info);
    //     wx.navigateBack({ changed: true });
    //   } else {
    //     wx.showToast({
    //       title: data.message,
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   }

    // }).catch(function (e) {
    //   console.log(e);
    // })
  },
  /**
   * 提交
   */
  deliverySubmit: function () {
    const _this = this;
    if (this.verifySubmit()) {
      // console.log('提交');
      const area = this.data.areaInfo.split(' ').join('');
      const detailed = this.data.detailed;
      // this.getLagLon(area, detailed).then((lat, lon) => {
      //   console.log(_this.data);
      //   _this.submitData();
      // })
      _this.submitData();
    }
  },
  /**
   * 验证
   */
  verifySubmit: function () {
    const data = this.data;
    const company = data.company;
    const contact = data.contact;
    const phone = data.phone;
    const proNumber = data.proNumber;
    const detailed = data.detailed;

    // 公司名称不能为空
    if (!company) {
      wx.showToast({
        title: '公司名称不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    // 公司名称必须输入2-16个字
    if (company.length < 2 || company.length > 16) {
      wx.showToast({
        title: '公司名称必须输入2-16个字之间',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    // 公司名称禁止输入特殊字符
    if (this.verify.notdot(company)) {
      wx.showToast({
        title: '公司名称禁止输入特殊字符',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    // console.log(!this.verify.hanEng(contact));
    // 联系人必须是大于2个字的中文或字母
    if ((contact && !this.verify.hanEng(contact)) || (contact == 1)) {
      wx.showToast({
        title: '联系人必须是大于2个字的中文或字母',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    // 联系电话不能为空
    if (!phone) {
      wx.showToast({
        title: '联系电话不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    // 联系电话为2-12位数字
    if (!this.verify.isNumberTel(phone)) {
      wx.showToast({
        title: '请输入正确纯数字的手机号或固话',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    // 区域地址
    if (this.data.areaInfo.indexOf("、") != -1) {
      wx.showToast({
        title: '请选择省市区地址',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    // 详细地址不能为空
    if (!detailed) {
      wx.showToast({
        title: '详细地址不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    //详细地址禁止输入非法字符
    if (this.verify.notdot(detailed)) {
      wx.showToast({
        title: '详细地址禁止输入非法字符',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  },
  /**
   * 返回添加列表数据
   */
  goback: function (info) {
    var _this = this;
    const data = _this.data;
    // 获取数据
    const aeraArr = data.areaInfo.split(' ');
    const aeraNumArr = data.areaNum.split(' ');
    var datainfo = info;
    // if (info) {
    //   datainfo = info;
    //   if (!datainfo.isDefault) {
    //     datainfo.isDefault = 0;
    //   }
    // } else {
    //   datainfo = {
    //     userId: data.userId,
    //     type: 2,
    //     id: data.id,
    //     company: data.company,
    //     contact: data.contact,
    //     phone: data.phone,
    //     proName: aeraArr[0],
    //     proNumber: aeraNumArr[0],
    //     cityName: aeraArr[1],
    //     cityNumber: aeraNumArr[1],
    //     areaName: aeraArr[2],
    //     areaNumber: aeraNumArr[2],
    //     detailed: data.detailed,
    //     lat: data.lat,
    //     lng: data.lng,
    //     isDefault: data.isDefault
    //   };
    // }

    datainfo['list'] = JSON.stringify(datainfo);
    // 判断是否是编辑

    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]  //上一个页面

    prevPage.setData({
      receiver: datainfo
    })

    // var list = prevPage.data.list;

    // if (data.isEdit) {

    //   for (let i = 0; i < list.length; i++) {
    //     if (list[i].id == data.id) {
    //       list.splice(i, 1, datainfo);
    //       break;
    //     }

    //     console.log(prevPage.data.list);
    //   }
    // } else {
    //   list.splice(0, 0, datainfo);
    // }
    // prevPage.setData({
    //   list: list
    // })
  }
})