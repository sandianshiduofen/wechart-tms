// 请求


const Util = require('./util.js')

function requestApi(api, path, params){
  return new Promise(function (resolve, reject){
    wx.request({
      url: `${api}${path}`,
      data: Object.assign({ 'requestTokenId': requestTokenId()}, params),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: resolve,
      fail: reject
    })
  })
}


function requestPostApi(api, path, params) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${api}${path}`,
      data: Util.json2Form(Object.assign({ 'requestTokenId': requestTokenId() }, params)),
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: resolve,
      fail: reject
    })
  })
}


function imgUpdateApi(api, path, filePath, params) {
  return new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: `${api}${path}`,
      filePath: filePath,
      name: 'file',
      formData: params,
      success: function (res) {
        resolve(res);
      },
      fail: function (e) {
        reject(e);
      }
    })
  })
}
function requestTokenId(num) {
  const len = num || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = $chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return 'wx_tms_' + pwd;
}

module.exports = {
  requestApi,
  requestPostApi,
  imgUpdateApi
};