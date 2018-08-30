const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}


/**
   * 将年月日转化为字符串
   */
function transformDateChuo(year, month, day, hours, minutes, seconds) {
  var date = new Date(year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds);

  var time1 = date.getTime();
  return time1;
}


/**
 * 日期自动填0
 */
function addZero(va) {
  if (va < 10) {
    return '0' + va;
  }
  return va;
}
/**
 * 分别转化为日期，时间
 */
function showDataFun(timestamp, type) {
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear();
  var M = addZero(date.getMonth() + 1);
  var D = addZero(date.getDate());
  var h = addZero(date.getHours());
  var m = addZero(date.getMinutes());
  var s = addZero(date.getSeconds());

  // 当前时间
  const curDate = new Date();
  const myYear = curDate.getFullYear();
  const myMonth = addZero((curDate.getMonth() + 1));
  const myDate = curDate.getDate();

  if (myYear == Y && myMonth == M && myDate == D && type == "data") {
    return '今天';
  }

  if (type == "MD") {
    return M + '-' + D;
  }

  if (type == "YMD") {
    return Y+'-'+M + '-' + D;
  }


  if (type == "hm") {
    return h + ':' + m;
  }
  if (type == "hms") {
    return h + ':' + m +":" +s;
  }

  if (type == "YMDhms") {
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
  }
}

module.exports = {
  formatTime: formatTime,
  json2Form: json2Form,
  showDataFun: showDataFun,
  transformDateChuo: transformDateChuo
}
