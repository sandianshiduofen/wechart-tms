// pages/search/search-good.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    goddsAttr: true,
    ascendingOrder: true,
    shoppingCartImg: "../../image/gouwuche@3x-hong.png",
    delImg: "../../image/search/guabi@3x.png",
    searchListShow: false,
    seatchText: '',
    current_tag: null,
    pageNumber: 10,
    curpage: 1,
    key: 1,
    order: 2,
    price_from: 26,
    price_to: '',
    b_id: '1449_5490',
    attr_value_id: '522_529',
    own_shop: '1',
    goods_kucun_kong: '1',
    goods_type: '1',

    filtrateList:[]

    // list: [
    //   {
    //     id: 0,
    //     title: "36",
    //     stock: 10
    //   },
    //   {
    //     id: 1,
    //     title: "37",
    //     stock: 0
    //   },
    //   {
    //     id: 2,
    //     title: "38",
    //     stock: 0
    //   },
    //   {
    //     id: 3,
    //     title: "39",
    //     stock: 10
    //   }
    // ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.getInfo())
    const getInfo = this.getInfo();
    const filtrateList = getInfo.datas.attr_array;

    this.setData({
      filtrateList: filtrateList
    })

    var that = this;
    const keywords = decodeURI(options.keywords);
    wx.request({
      url: 'http://newwww.zhongdamen.com/mobile/index.php?act=goods&op=goods_list',
      data: {
        keyword: keywords,//'面膜',
      },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        that.setData({
          goodData: res.data.datas.goods_list,

        })
      },
      fail: function () {
        console.log("获取数据失败");
      },
      complete: function () {
        wx.hideToast();
      }
    })
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

  },
  // 删除搜索框文字
  delTop: function () {
    wx.navigateTo({
      url: "../search-page/search-page"
    })
  },
  //点击筛选事件
  filter: function (e) {
    var animation = wx.createAnimation({//创建动画
      duration: 1000,
      timingFunction: 'ease',
      width: 300,
      height: 800,
      top: 0,
      bottom: 0,
      right: 0,
      backgroundColor: '#fff',
      opcity: 0.5
    })
    this.animation = animation
    animation.translateX(-100 + 'vh').step() //动画效果向右滑动100vh
    this.setData({
      animationData: animation.export(),
      show: true
    });
    wx.request({
      url: 'http://newwww.zhongdamen.com/mobile/index.php?act=goods&op=goods_list',
      data: {
        //page: that.data.pageNumber,
        //curpage: that.data.curpage,
        keyword: '面膜',
        //key:that.data.key,
        //order: that.data.order,
        //price_from: that.data.price_from,
        //price_to: that.data.price_to,
        //b_id: that.data.b_id,
        //attr_value_id: that.data.attr_value_id,
        //own_shop: that.data.own_shop,
        //goods_kucun_kong: that.data.goods_kucun_kong,
        //goods_type: that.data.goods_type,
      },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res.data.datas.attr_array)
        that.setData({
          //goodData: res.data.datas.goods_list,
          list: res.data.datas.attr_array,//品牌列表
        })
      }
    })
  },


  //确定按钮
  confirmTop: function (e) {
    var animation = wx.createAnimation({//创建动画
      duration: 1000,
      timingFunction: 'ease',
      width: 300,
      height: 800,
      top: 0,
      bottom: 0,
      right: 0,
      backgroundColor: '#fff',
      opcity: 0.5
    })
    this.animation = animation
    animation.translateX(100 + 'vh').step() //动画效果向右滑动100vh
    this.setData({
      animationData: animation.export(),
      show: false
    })
    var that = this;
    wx.showToast({
      title: '载入中',
      icon: 'loading',
      duration: 60000
    })
    wx.request({
      url: 'http://newwww.zhongdamen.com/mobile/index.php?act=goods&op=goods_list',
      data: {
        //page: that.data.pageNumber,
        //curpage: that.data.curpage,
        keyword: '面膜',
        //key:that.data.key,
        //order: that.data.order,
        //price_from: that.data.price_from,
        //price_to: that.data.price_to,
        //b_id: that.data.b_id,
        //attr_value_id: that.data.attr_value_id,
        //own_shop: that.data.own_shop,
        //goods_kucun_kong: that.data.goods_kucun_kong,
        //goods_type: that.data.goods_type,
      },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res.data.datas.brand_array)
        that.setData({
          goodData: res.data.datas.goods_list,
          //list: res.data.datas.brand_array,//品牌列表
        })
      },
      fail: function () {
        console.log("获取数据失败");
      },
      complete: function () {
        wx.hideToast();
      }
    })
  },



  //input获取焦点时
  searchGoods: function () {
    this.setData({
      searchListShow: true,
    })
  },
  // 点击搜索出的标题
  searchGoodsTop: function () {
    this.setData({
      searchListShow: false,
    })
  },
  ascendingOrder: function () {
    if (this.data.ascendingOrder) {
      this.setData({
        ascendingOrder: false
      })
    } else {
      this.setData({
        ascendingOrder: true
      })
    }
  },
  goddsAttrTop: function () {
    if (this.data.goddsAttr) {
      this.setData({
        goddsAttr: false
      })
    } else {
      this.setData({
        goddsAttr: true
      })
    }
  },
  clickedClassify: function (event) {
    let that = this;
    var id = event.currentTarget.dataset.id;  //获取自定义的ID值 
    //console.log("current_tag", id)
    this.setData({
      current_tag: id,
    })
  },
  //重置按钮
  canelTop: function () {

  },

  getInfo:function(){
    var info = {
      "code": 200,
      "hasmore": true,
      "page_total": 43,
      "datas": {
        "goods_list": [
          {
            "goods_id": "26648",
            "store_id": "26",
            "goods_name": "SNP燕窝海洋面膜10片/盒",
            "goods_jingle": "燕窝 补水保湿 淡化细纹 滋润肌肤 正品",
            "goods_price": "10.00",
            "goods_promotion_type": "0",
            "goods_marketprice": "20.00",
            "goods_image": "26_05868633026764460.jpg",
            "goods_salenum": "5",
            "evaluation_good_star": "5",
            "evaluation_count": "0",
            "goods_tax_price": "0.00",
            "goods_type": "0",
            "goods_storage": "45",
            "is_virtual": "0",
            "is_presell": "0",
            "is_fcode": "0",
            "have_gift": "0",
            "store_name": "小红帽1",
            "is_own_shop": "0",
            "goods_evaluate_info": {
              "good": 0,
              "normal": 0,
              "bad": 0,
              "all": 0,
              "img": 0,
              "good_percent": 100,
              "normal_percent": 0,
              "bad_percent": 0,
              "good_star": 5,
              "star_average": 5
            },
            "goods_yh_title": {
              "yh_title": {
                "jg": "",
                "zk": "",
                "zht": ""
              },
              "yh_status": false,
              "yh_label": null
            },
            "sole_flag": false,
            "group_flag": false,
            "xianshi_flag": false,
            "goods_image_url": "https://newwww.zhongdamen.com/data/upload/shop/store/goods/26/26_05868633026764460_360.jpg",
            "thumb_image": "https://newwww.zhongdamen.com/data/upload/shop/store/goods/26/26_05868633026764460_360.jpg"
          },
          {
            "goods_id": "26645",
            "store_id": "44",
            "goods_name": "韩国SNP面膜海洋燕窝水库面膜补水保湿收缩毛孔提亮肤色控油 10片 补水保湿",
            "goods_jingle": "补水保湿 深层清洁",
            "goods_price": "0.01",
            "goods_promotion_type": "0",
            "goods_marketprice": "99.00",
            "goods_image": "44_05864608677134252.png",
            "goods_salenum": "4",
            "evaluation_good_star": "5",
            "evaluation_count": "0",
            "goods_tax_price": "0.00",
            "goods_type": "0",
            "goods_storage": "46",
            "is_virtual": "0",
            "is_presell": "0",
            "is_fcode": "0",
            "have_gift": "0",
            "store_name": "臻品馆",
            "is_own_shop": "0",
            "goods_evaluate_info": {
              "good": 0,
              "normal": 0,
              "bad": 0,
              "all": 0,
              "img": 0,
              "good_percent": 100,
              "normal_percent": 0,
              "bad_percent": 0,
              "good_star": 5,
              "star_average": 5
            },
            "goods_yh_title": {
              "yh_title": {
                "jg": "",
                "zk": "",
                "zht": ""
              },
              "yh_status": false,
              "yh_label": null
            },
            "sole_flag": false,
            "group_flag": false,
            "xianshi_flag": false,
            "goods_image_url": "https://newwww.zhongdamen.com/data/upload/shop/store/goods/44/44_05864608677134252_360.png",
            "thumb_image": "https://newwww.zhongdamen.com/data/upload/shop/store/goods/44/44_05864608677134252_360.png"
          },
          {
            "goods_id": "26635",
            "store_id": "44",
            "goods_name": "snp 燕窝面膜 测试",
            "goods_jingle": "",
            "goods_price": "160.00",
            "goods_promotion_type": "0",
            "goods_marketprice": "189.00",
            "goods_image": "44_05775368972546412.jpg",
            "goods_salenum": "0",
            "evaluation_good_star": "5",
            "evaluation_count": "0",
            "goods_tax_price": "40.85",
            "goods_type": "2",
            "goods_storage": "0",
            "is_virtual": "0",
            "is_presell": "0",
            "is_fcode": "0",
            "have_gift": "0",
            "store_name": "臻品馆",
            "is_own_shop": "0",
            "goods_evaluate_info": {
              "good": 0,
              "normal": 0,
              "bad": 0,
              "all": 0,
              "img": 0,
              "good_percent": 100,
              "normal_percent": 0,
              "bad_percent": 0,
              "good_star": 5,
              "star_average": 5
            },
            "goods_yh_title": {
              "yh_title": {
                "jg": "",
                "zk": "",
                "zht": ""
              },
              "yh_status": false,
              "yh_label": null
            },
            "sole_flag": false,
            "group_flag": false,
            "xianshi_flag": false,
            "goods_image_url": "https://newwww.zhongdamen.com/data/upload/shop/store/goods/44/44_05775368972546412_360.jpg",
            "thumb_image": "https://newwww.zhongdamen.com/data/upload/shop/store/goods/44/44_05775368972546412_360.jpg"
          },
          {
            "goods_id": "26622",
            "store_id": "44",
            "goods_name": "repair vital 胎盘素面膜 17g 蜗牛&amp;EGF",
            "goods_jingle": "",
            "goods_price": "70.00",
            "goods_promotion_type": "0",
            "goods_marketprice": "90.00",
            "goods_image": "",
            "goods_salenum": "0",
            "evaluation_good_star": "5",
            "evaluation_count": "0",
            "goods_tax_price": "17.87",
            "goods_type": "2",
            "goods_storage": "20",
            "is_virtual": "0",
            "is_presell": "0",
            "is_fcode": "0",
            "have_gift": "0",
            "store_name": "臻品馆",
            "is_own_shop": "0",
            "goods_evaluate_info": {
              "good": 0,
              "normal": 0,
              "bad": 0,
              "all": 0,
              "img": 0,
              "good_percent": 100,
              "normal_percent": 0,
              "bad_percent": 0,
              "good_star": 5,
              "star_average": 5
            },
            "goods_yh_title": {
              "yh_title": {
                "jg": "",
                "zk": "",
                "zht": ""
              },
              "yh_status": false,
              "yh_label": null
            },
            "sole_flag": false,
            "group_flag": false,
            "xianshi_flag": false,
            "goods_image_url": "http://www.zhongdamen.com/public/images/73/1a/e3/32d5b9b716694882095879239f7d7f2f.jpg",
            "thumb_image": "http://www.zhongdamen.com/public/images/73/1a/e3/32d5b9b716694882095879239f7d7f2f.jpg"
          },
          {
            "goods_id": "26539",
            "store_id": "56",
            "goods_name": "单规格免运费面膜",
            "goods_jingle": "商品卖点商品卖点商品卖点商品卖点商品卖点商品卖点商品卖点商品卖点商品卖点",
            "goods_price": "130.00",
            "goods_promotion_type": "0",
            "goods_marketprice": "140.00",
            "goods_image": "56_05581142828467893.jpg",
            "goods_salenum": "4",
            "evaluation_good_star": "5",
            "evaluation_count": "0",
            "goods_tax_price": "0.00",
            "goods_type": "0",
            "goods_storage": "4440",
            "is_virtual": "0",
            "is_presell": "0",
            "is_fcode": "0",
            "have_gift": "0",
            "store_name": "马来西亚",
            "is_own_shop": "0",
            "goods_evaluate_info": {
              "good": 0,
              "normal": 0,
              "bad": 0,
              "all": 0,
              "img": 0,
              "good_percent": 100,
              "normal_percent": 0,
              "bad_percent": 0,
              "good_star": 5,
              "star_average": 5
            },
            "goods_yh_title": {
              "yh_title": {
                "jg": "",
                "zk": "",
                "zht": ""
              },
              "yh_status": false,
              "yh_label": null
            },
            "sole_flag": false,
            "group_flag": false,
            "xianshi_flag": false,
            "goods_image_url": "https://newwww.zhongdamen.com/data/upload/shop/common/default_goods_image_360.gif",
            "thumb_image": "https://newwww.zhongdamen.com/data/upload/shop/common/default_goods_image_360.gif"
          }
        ],
        "brand_array": [
          {
            "brand_id": "381",
            "brand_name": "Sulwhasoo雪花秀",
            "brand_initial": "X",
            "brand_pic": "05271595376951558_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "382",
            "brand_name": "kose高丝",
            "brand_initial": "G",
            "brand_pic": "05271596252437275_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "383",
            "brand_name": "It's Skin伊思",
            "brand_initial": "Y",
            "brand_pic": "05271596557068139_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "1771",
            "brand_name": "Natural&amp;Pure",
            "brand_initial": "N",
            "brand_pic": "",
            "show_type": "0"
          },
          {
            "brand_id": "1362",
            "brand_name": "Utena 佑天兰",
            "brand_initial": "Y",
            "brand_pic": "",
            "show_type": "0"
          },
          {
            "brand_id": "1336",
            "brand_name": "WHOO 后",
            "brand_initial": "H",
            "brand_pic": "05297552593152208_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "1303",
            "brand_name": "LOSHI 北海道",
            "brand_initial": "B",
            "brand_pic": "05296993234640084_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "1268",
            "brand_name": "Papa recipe春雨",
            "brand_initial": "P",
            "brand_pic": "05297511162837358_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "1216",
            "brand_name": "LANEIGE 兰芝",
            "brand_initial": "L",
            "brand_pic": "05297553328295132_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "1185",
            "brand_name": "睿姿丽",
            "brand_initial": "R",
            "brand_pic": "05297603554857980_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "1168",
            "brand_name": "Kracie嘉娜宝",
            "brand_initial": "K",
            "brand_pic": "",
            "show_type": "0"
          },
          {
            "brand_id": "1128",
            "brand_name": "JAYJUN",
            "brand_initial": "J",
            "brand_pic": "05297537536665084_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "1369",
            "brand_name": "minon 蜜浓",
            "brand_initial": "M",
            "brand_pic": "05297522356860567_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "1397",
            "brand_name": "nature republic自然乐园",
            "brand_initial": "N",
            "brand_pic": "05297026924723714_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "1770",
            "brand_name": "Nature's Beauty",
            "brand_initial": "N",
            "brand_pic": "",
            "show_type": "0"
          },
          {
            "brand_id": "1839",
            "brand_name": "Vissean D.S.F",
            "brand_initial": "V",
            "brand_pic": "",
            "show_type": "0"
          },
          {
            "brand_id": "1541",
            "brand_name": "豆腐盛田屋",
            "brand_initial": "D",
            "brand_pic": "05297523915366592_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "1499",
            "brand_name": "SCHAEBENS雪本诗",
            "brand_initial": "S",
            "brand_pic": "",
            "show_type": "0"
          },
          {
            "brand_id": "1461",
            "brand_name": "rainbow",
            "brand_initial": "R",
            "brand_pic": "05297606154632889_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "1449",
            "brand_name": "SNP",
            "brand_initial": "S",
            "brand_pic": "05297500176581233_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "1426",
            "brand_name": "su:m37° 呼吸",
            "brand_initial": "H",
            "brand_pic": "05297069723442551_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "1408",
            "brand_name": "NENA",
            "brand_initial": "N",
            "brand_pic": "",
            "show_type": "0"
          },
          {
            "brand_id": "1123",
            "brand_name": "Jacob hooy雅歌布赫伊",
            "brand_initial": "J",
            "brand_pic": "05297073387836442_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "1023",
            "brand_name": "HOLIKA",
            "brand_initial": "H",
            "brand_pic": "05297697839293636_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "655",
            "brand_name": "CAUDALIE 欧缇丽",
            "brand_initial": "C",
            "brand_pic": "",
            "show_type": "0"
          },
          {
            "brand_id": "549",
            "brand_name": "AHC",
            "brand_initial": "A",
            "brand_pic": "05297022887908483_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "496",
            "brand_name": "Royal Nectar",
            "brand_initial": "R",
            "brand_pic": "",
            "show_type": "0"
          },
          {
            "brand_id": "488",
            "brand_name": "Merino",
            "brand_initial": "M",
            "brand_pic": "",
            "show_type": "0"
          },
          {
            "brand_id": "478",
            "brand_name": "Leaders丽得姿",
            "brand_initial": "L",
            "brand_pic": "05297071355765071_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "476",
            "brand_name": "Balea 芭乐雅",
            "brand_initial": "B",
            "brand_pic": "",
            "show_type": "0"
          },
          {
            "brand_id": "456",
            "brand_name": "Elizavecca",
            "brand_initial": "E",
            "brand_pic": "05297606860268949_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "388",
            "brand_name": "innisfree 悦诗风吟",
            "brand_initial": "Y",
            "brand_pic": "05300318100325085_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "133",
            "brand_name": "雅诗兰黛",
            "brand_initial": "Y",
            "brand_pic": "04398102581821577_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "684",
            "brand_name": "CHANEL 香奈儿",
            "brand_initial": "C",
            "brand_pic": "",
            "show_type": "0"
          },
          {
            "brand_id": "698",
            "brand_name": "CHITO-AE",
            "brand_initial": "C",
            "brand_pic": "05297608548617512_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "1333",
            "brand_name": "Mediheal 美迪惠尔",
            "brand_initial": "M",
            "brand_pic": "05297498357582765_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "933",
            "brand_name": "Forencos",
            "brand_initial": "F",
            "brand_pic": "05296988588505277_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "874",
            "brand_name": "马油",
            "brand_initial": "M",
            "brand_pic": "",
            "show_type": "0"
          },
          {
            "brand_id": "840",
            "brand_name": "Dr.jart+ 蒂佳婷",
            "brand_initial": "D",
            "brand_pic": "",
            "show_type": "0"
          },
          {
            "brand_id": "939",
            "brand_name": "Freeman",
            "brand_initial": "F",
            "brand_pic": "05296987023302406_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "759",
            "brand_name": "Coregen",
            "brand_initial": "C",
            "brand_pic": "05297539060586767_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "720",
            "brand_name": "Clinie 可莱丝",
            "brand_initial": "C",
            "brand_pic": "05297543628490854_sm.jpg",
            "show_type": "0"
          },
          {
            "brand_id": "1767",
            "brand_name": "beauteous",
            "brand_initial": "B",
            "brand_pic": "",
            "show_type": "1"
          },
          {
            "brand_id": "1726",
            "brand_name": "23 years old",
            "brand_initial": "Y",
            "brand_pic": "",
            "show_type": "1"
          },
          {
            "brand_id": "1392",
            "brand_name": "NATIO 娜迪奥",
            "brand_initial": "N",
            "brand_pic": "",
            "show_type": "1"
          },
          {
            "brand_id": "1669",
            "brand_name": "Sukin苏芊",
            "brand_initial": "S",
            "brand_pic": "",
            "show_type": "1"
          },
          {
            "brand_id": "1580",
            "brand_name": "LA-G",
            "brand_initial": "L",
            "brand_pic": "",
            "show_type": "1"
          },
          {
            "brand_id": "883",
            "brand_name": "Esthetic House",
            "brand_initial": "E",
            "brand_pic": "",
            "show_type": "1"
          },
          {
            "brand_id": "1217",
            "brand_name": "曼丹",
            "brand_initial": "M",
            "brand_pic": "",
            "show_type": "1"
          },
          {
            "brand_id": "886",
            "brand_name": "KASAROS",
            "brand_initial": "K",
            "brand_pic": "",
            "show_type": "1"
          },
          {
            "brand_id": "1658",
            "brand_name": "Kiehl's 科颜氏",
            "brand_initial": "K",
            "brand_pic": "",
            "show_type": "1"
          }
        ],
        "attr_array": [
          {
            "name": "价格",
            "value": [
              {
                "attr_value_id": "522",
                "attr_value_name": "0-29",
                "attr_id": "92"
              },
              {
                "attr_value_id": "523",
                "attr_value_name": "30-89",
                "attr_id": "92"
              },
              {
                "attr_value_id": "524",
                "attr_value_name": "90-179",
                "attr_id": "92"
              },
              {
                "attr_value_id": "525",
                "attr_value_name": "180-319",
                "attr_id": "92"
              },
              {
                "attr_value_id": "526",
                "attr_value_name": "320-489",
                "attr_id": "92"
              },
              {
                "attr_value_id": "527",
                "attr_value_name": "490-1299",
                "attr_id": "92"
              },
              {
                "attr_value_id": "528",
                "attr_value_name": "1300以上",
                "attr_id": "92"
              }
            ]
          },
          {
            "name": "功效",
            "value": [
              {
                "attr_value_id": "529",
                "attr_value_name": "补水/保湿",
                "attr_id": "93"
              },
              {
                "attr_value_id": "530",
                "attr_value_name": "美白/淡斑",
                "attr_id": "93"
              },
              {
                "attr_value_id": "531",
                "attr_value_name": "细致毛孔",
                "attr_id": "93"
              },
              {
                "attr_value_id": "532",
                "attr_value_name": "抗衰/祛皱",
                "attr_id": "93"
              },
              {
                "attr_value_id": "533",
                "attr_value_name": "提拉紧致",
                "attr_id": "93"
              },
              {
                "attr_value_id": "534",
                "attr_value_name": "控油平衡",
                "attr_id": "93"
              },
              {
                "attr_value_id": "535",
                "attr_value_name": "去眼袋",
                "attr_id": "93"
              },
              {
                "attr_value_id": "536",
                "attr_value_name": "淡化黑眼圈",
                "attr_id": "93"
              },
              {
                "attr_value_id": "537",
                "attr_value_name": "舒缓镇静",
                "attr_id": "93"
              },
              {
                "attr_value_id": "538",
                "attr_value_name": "其他",
                "attr_id": "93"
              }
            ]
          },
          {
            "name": "分类",
            "value": [
              {
                "attr_value_id": "539",
                "attr_value_name": "面膜",
                "attr_id": "94"
              },
              {
                "attr_value_id": "540",
                "attr_value_name": "眼膜",
                "attr_id": "94"
              },
              {
                "attr_value_id": "541",
                "attr_value_name": "鼻贴膜",
                "attr_id": "94"
              },
              {
                "attr_value_id": "542",
                "attr_value_name": "唇膜",
                "attr_id": "94"
              },
              {
                "attr_value_id": "543",
                "attr_value_name": "其他",
                "attr_id": "94"
              }
            ]
          },
          {
            "name": "类型",
            "value": [
              {
                "attr_value_id": "544",
                "attr_value_name": "贴片式",
                "attr_id": "95"
              },
              {
                "attr_value_id": "545",
                "attr_value_name": "睡眠免洗式",
                "attr_id": "95"
              },
              {
                "attr_value_id": "546",
                "attr_value_name": "膏泥状",
                "attr_id": "95"
              },
              {
                "attr_value_id": "547",
                "attr_value_name": "撕拉式",
                "attr_id": "95"
              },
              {
                "attr_value_id": "548",
                "attr_value_name": "水洗式",
                "attr_id": "95"
              },
              {
                "attr_value_id": "549",
                "attr_value_name": "乳霜状",
                "attr_id": "95"
              },
              {
                "attr_value_id": "550",
                "attr_value_name": "颗粒状",
                "attr_id": "95"
              },
              {
                "attr_value_id": "551",
                "attr_value_name": "粉状",
                "attr_id": "95"
              },
              {
                "attr_value_id": "552",
                "attr_value_name": "其他",
                "attr_id": "95"
              }
            ]
          },
          {
            "name": "适合皮肤",
            "value": [
              {
                "attr_value_id": "553",
                "attr_value_name": "偏干及干性",
                "attr_id": "96"
              },
              {
                "attr_value_id": "554",
                "attr_value_name": "偏油及油性",
                "attr_id": "96"
              },
              {
                "attr_value_id": "555",
                "attr_value_name": "痘痘肌",
                "attr_id": "96"
              },
              {
                "attr_value_id": "556",
                "attr_value_name": "混合性",
                "attr_id": "96"
              },
              {
                "attr_value_id": "557",
                "attr_value_name": "敏感肌",
                "attr_id": "96"
              },
              {
                "attr_value_id": "558",
                "attr_value_name": "所有肤质",
                "attr_id": "96"
              },
              {
                "attr_value_id": "559",
                "attr_value_name": "其他",
                "attr_id": "96"
              }
            ]
          },
          {
            "name": "产地",
            "value": [
              {
                "attr_value_id": "560",
                "attr_value_name": "欧美",
                "attr_id": "97"
              },
              {
                "attr_value_id": "561",
                "attr_value_name": "韩国",
                "attr_id": "97"
              },
              {
                "attr_value_id": "562",
                "attr_value_name": "日本",
                "attr_id": "97"
              },
              {
                "attr_value_id": "563",
                "attr_value_name": "泰国",
                "attr_id": "97"
              },
              {
                "attr_value_id": "564",
                "attr_value_name": "澳大利亚",
                "attr_id": "97"
              },
              {
                "attr_value_id": "7285",
                "attr_value_name": "法国",
                "attr_id": "97"
              },
              {
                "attr_value_id": "565",
                "attr_value_name": "其他",
                "attr_id": "97"
              }
            ]
          },
          {
            "name": "面贴膜数量",
            "value": [
              {
                "attr_value_id": "566",
                "attr_value_name": "1片",
                "attr_id": "98"
              },
              {
                "attr_value_id": "567",
                "attr_value_name": "2~5片",
                "attr_id": "98"
              },
              {
                "attr_value_id": "568",
                "attr_value_name": "6~10片",
                "attr_id": "98"
              },
              {
                "attr_value_id": "569",
                "attr_value_name": "11~20片",
                "attr_id": "98"
              },
              {
                "attr_value_id": "570",
                "attr_value_name": "21片及以上",
                "attr_id": "98"
              },
              {
                "attr_value_id": "571",
                "attr_value_name": "其他",
                "attr_id": "98"
              }
            ]
          }
        ]
      }
    }
    return info;
  }

})