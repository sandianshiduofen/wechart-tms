// 输入框正则验证

// 输入6-16的密码
function ispsw(psw) {
  var pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/;
  console.log(pattern.test(psw))
  return pattern.test(psw);
}
/*中文*/
function hanEng(text) {
  var pattern = /^[\u4E00-\u9FA5A-Za-z]+$/;
  return pattern.test(text);
}
/*判断不能为非法字符*/
function notdot(stry) {
  var pattern = new RegExp("[`~!@#$^&*=|{}':;',\\[\\].<>/?！@#￥……&*|{}‘；：”“'。，？]");
  return pattern.test(stry);
}

/*验证手机号*/
function isPhoneNo(phone) {
  var pattern = /^1\d{10}$/;
  return pattern.test(phone);
}
/*验证验证码*/
function istelverify(verify) {
  var pattern = /^\d{4,7}$/;
  return pattern.test(verify);
}
// 7-12数字
function isNumberTel(tel) {
  var pattern = /^\d{7,12}$/;
  return pattern.test(tel);
}

/*小于100万金额验证*/
function isPirce(verify) {
  var pattern = /^\d{1,6}(\.\d{1,2})?$/;
  return pattern.test(verify);
}

module.exports = {
  ispsw,
  hanEng,
  notdot,
  isNumberTel,
  istelverify,
  isPhoneNo,
  isPirce
}