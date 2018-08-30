// 请求
const requrieApi = require('./requrie')
/**
 * 准生产
 */
// const api = {
//   wxApi: 'http://pweixinapi.3zqp.com',
//   wxApiAn: 'http://ptms.3zqp.com',
//   wxApiAnY: 'http://ptms.3zqp.com',
//   wxApiHai: 'http://ptmsimg.3zqp.com',
//   wxApiZhao: 'http://pappapi.3zqp.com',
//   apiHaiL: 'http://pacc.3zqp.com',
//   imgShowApi: 'https://3zxgimg.oss-cn-beijing.aliyuncs.com/',
//   appid: 'wx9d37162460f921d8',
//   redirectUri: 'http://192.168.0.73'
// }
/**
 * 测试
 */
const api = {
  wxApi: 'http://tweixinapi.3zqp.com',
  wxApiAn: 'http://ttms.3zqp.com',
  wxApiAnY: 'http://ttms.3zqp.com',
  wxApiHai: 'http://ttmsimg.3zqp.com',
  wxApiZhao: 'http://tappapi.3zqp.com',
  apiHaiL: 'http://tacc.3zqp.com',
  imgShowApi: 'https://3zxgimg.oss-cn-beijing.aliyuncs.com/',
  appid: 'wx9d37162460f921d8',
  redirectUri: 'http://192.168.0.73'
}

function wxApiApp(path, params){
  return requrieApi.requestApi(api.wxApi, path, params);
}

function wxApiAnApp(path, params) {
  return requrieApi.requestApi(api.wxApiAn, path, params);
}

function wxApiAnYApp(path, params) {
  return requrieApi.requestApi(api.wxApiAnY, path, params);
}

function wxApiHaiApp(path, pathUrl, params) {
  console.log(pathUrl)
  return requrieApi.imgUpdateApi(api.wxApiHai, path, pathUrl, params);
}

function wxApiZhaoApp(path, params) {
  return requrieApi.requestApi(api.wxApiZhao, path, params);
}

function apiHaiLApp(path, params) {
  return requrieApi.requestApi(api.apiHaiL, path, params);
}

module.exports = {
  wxApiApp,
  wxApiAnApp,
  wxApiAnYApp,
  wxApiHaiApp,
  wxApiZhaoApp,
  apiHaiLApp,
  api
}