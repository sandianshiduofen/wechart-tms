//获取应用实例
const app = getApp()

Page({
  data: {
    filePath:"",
    type:3,
    path:'headImg',
    file:'',
    srcImg:''
  },
  upload() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]

        wx.redirectTo({
          url: `./upload/upload?src=${src}`
        })
      }
    })
  },
  onLoad(option) {
    const { avatar, headUrl} = option;
    var _this=this;
    const userInfo = app.globalData.userInfo;
    const path = app.requrieApi.api.imgShowApi;
    _this.setData({
      srcImg: path + userInfo.headUrl
    })
    
    if (avatar) {
      this.setData({
        file: avatar
      })
      this.formSubmit()
    }
  },
  formSubmit: function () {
    wx.showLoading({
      title: '加载中',
    })
    const _this=this;
    this.updateImg().then(function(){
      const pathUrl = "/api/wx/hand/add_v1";

      const userInfo = app.globalData.userInfo;
      const userId = userInfo.id;
      const type = userInfo.type;
      const data = {
        userId: userId,
        headUrl: _this.data.filePath,
        type: type,
      }
      return app.requrieApi.wxApiApp(pathUrl, data).then(function (d) {
        wx.hideLoading();
        const data = d.data;
        if (data.success) {
          const path = app.requrieApi.api.imgShowApi;
          _this.setData({
            srcImg: path + _this.data.filePath
          })

          app.updateInfo('headUrl', _this.data.filePath);

          wx.showToast({
            title: '上传成功',
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
      
    }).catch(function(e){
      // 上传失败的情况
      wx.showToast({
        title: '上传失败',
        icon: 'none',
        duration: 2000
      })
    })
  },
  updateImg: function () {
    return new Promise((resolve, reject)=>{
      const pathUrl = "/api/tms/wx/upload";
      const data = this.data;
      const tempFilePaths = this.data.file;
      const _self = this;
      
      return app.requrieApi.wxApiHaiApp(pathUrl, tempFilePaths ,data).then(function (d) {
        wx.hideLoading();
        const data = JSON.parse(d.data);
        if (data.success) {
          const info = data.info;
          const imgUrl = info.domain + info.filePath;
          _self.setData({
            file: imgUrl,
            filePath: info.filePath
          })
          return resolve();
        }
        reject(data.message);
      }).catch(function (e) {
        reject(e)
      })
    })
  },
  onUnload: function () {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]  //上一个页面
    var _this = this
    prevPage.setData({
      headUrl: _this.data.srcImg
    })
  }
})
