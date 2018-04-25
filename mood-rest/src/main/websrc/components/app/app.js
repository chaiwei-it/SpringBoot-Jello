var jQuery = require('jquery/jquery-3.3.1.min.js');
window._ = require('lodash/index');
var color = 'color:rgb(66, 185, 131)';
var switchs = true;
require('amaze/assets/js/amazeui.min.js')
require('jquery-validation-1.14.0/jquery.validate.min.js')


window.jQuery = jQuery || $

var app = function (self) {

  /**
   *  跳转新页面url
   *  @param {String} url         需要跳转的url
   *  @param return
   */
  self.openUrl = function (url, type) {
    if (_.isUndefined(type)) {
      window.location.href = url
    } else {
      window.open(url, type)
    }
  };

  /**
   *  打印日志
   *  @param {String} msg         传过来的字符串信息
   *  @param return
   */
  self.logger = function (msg) {
    if (switchs) console.log(msg)
  }

  /**
   *  获取url传过来的参数
   *  @param {String} name        获取的参数
   *  @param {String} Url         自定义获取参数的链接
   *  @param return
   */
  self.getUrlQuery = function (name, Url) {
    var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
    var url = Url || window.location.href;
    if (reg.test(url)) {
      return decodeURI(RegExp.$2.replace(/\+/g, ' '));
    }
    return ''
  }

  /**
   *  获取系统时间
   *  @param {String} opt        需要获取的时间格式 Y:M:D
   *  @param return
   */
  self.getDate = function (opt) {
    var date = new Date();
    var year = date.getFullYear().toString()
    var month = (date.getMonth() + 1).toString()
    var day = date.getDate().toString()

    // 时间转换如果时间长度为1则加0
    month = month.length > 1 ? '' + month : '0' + month
    day = day.length > 1 ? '' + day : '0' + day

    // 获取时间分割符
    var chars = opt.replace(/[a-zA-Z]/g, '');
    var splits = chars.substring(0, chars.length - 1)

    // 定义一个空的字符串
    var timer = '';
    opt.split(splits).forEach(function (value, index) {
      value = value.toUpperCase();
      if (value === 'Y') {
        timer += year + splits
      } else if (value === 'M') {
        timer += month + splits
      } else if (value === 'D') {
        timer += day + splits
      }
    })
    if (!_.isEmpty(splits)) {
      timer = timer.substring(0, timer.length - 1);
    }
    return timer
  }
  /**
   *  获取模板元素
   *  @param {String} element         模板元素ID
   *  @param return
   */
  self.loadHtml = function (element) {
    var compiled;
    // is jQuery Object
    if (element instanceof jQuery) {
      compiled = _.template(element.html());
    }
    // is Array
    if (_.isArray(element)) {
      compiled = _.template(element.join(''));
    }
    // is String
    if (_.isString(element)) {
      compiled = _.template(element);
    }
    return compiled
  }

  /**
   *  全局ajax
   *  @param {String} url             请求地址
   *  @param {String} type            请求的类型
   *  @param {Object} param           请求参数
   *  @param {Function} callback      请求成功后，这里会有两个参数,服务器返回数据，返回状态，[data, res]
   *  @param return
   */
  self.ajax = function (url, type, param, callback) {
    var user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      param.access_token = user.access_token;
    }
    if (switchs) {
      console.log('%c接口: ' + url, color);
      console.log('%c类型: ' + type, color);
      console.log('%c参数: ' + JSON.stringify(param), color);
    }
    jQuery.ajax({
      url: url,
      type: type,
      data: param,
      contentType: 'application/x-www-form-urlencoded',
      // timeout: 50000,
      dataType: 'json',
      success: function (data) {
        try {
          if (switchs) console.info('🙄成功返回==>', data)
          callback(data)
          // 未登录
          if (data.code === 401) {
            $("#goLogin").click()
          }
        } catch (e) {
          if (switchs) console.error(e)
        }
      },
      error: function (xhr, e) {
        if (switchs) console.error(xhr.statusText);
      }
    });
  }
  self.gets = function (name) {
    // 本地存储-获取
    var value = localStorage.getItem(name)
    if (/^\{.*\}$/.test(value)) value = JSON.parse(value)
    return value
  }
  self.sets = function (name, value) {
    // 本地存储-设置
    if (typeof value === typeof {}) value = JSON.stringify(value)
    return localStorage.setItem(name, value)
  }
  self.remove = function (name) {
    // 本地存储-删除
    return localStorage.removeItem(name)
  }
  self.getTime = function (time, date) {
    // 处理时间戳
    var createTime = '';
    var date = new Date();
    date.setTime(time);
    createTime += date.getFullYear();
    createTime += '-' + (date.getMonth(date) + 1);
    createTime += '-' + date.getDate(date);

    if (!date) {
      var hours = date.getHours(date);
      if (hours < 10) hours = '0' + hours;
      createTime += ' ' + hours;
      var minutes = date.getMinutes(date);
      if (minutes < 10) minutes = '0' + minutes;
      createTime += ':' + minutes;
      var seconds = date.getSeconds(date);
      if (seconds < 10) seconds = '0' + seconds;
      createTime += ':' + seconds;
    }

    return createTime;
  }

  self.getUnixTime = function (dateStr) {
    /*
     ** 时间戳转换
     */
    var newstr = dateStr.replace(/-/g, '/');
    var date = new Date(newstr);
    var time_str = date.getTime().toString();
    return time_str;
  }

  self.HTMLDecode = function (text) {
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
  }

  /**
   *  全局图片上传
   *  @param {String} url             请求地址  /memberapi/filesUpload
   *  @param {object} form            文件 例如 $(input)[0].files[0]
   *  @param {function} callback      成功回调
   *  @param {function} error         失败的回调
   *  @param return
   */
  self.uploadImg = function (url, fileImg, callback, error) {

    // h5接口 toekn处理
    // var artToken = '';
    // var USERINFO = local.getItem('USERINFO');
    // console.log('USERINFO', USERINFO)
    // if (USERINFO) artToken = USERINFO.art_token;
    console.log('%c接口: ' + url, color);
    var formData = new FormData();
    formData.append('file', fileImg);
    var xhr = new XMLHttpRequest();
    xhr.open("post", url, true);
    xhr.setRequestHeader('enctype', 'multipart/form-data');
    xhr.send(formData);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) callback(xhr.responseText);
        else error(xhr)
      }
    }
  }

  self.message = function (message, type, callback) {
    // 消息提示
    var alertEle = $('<div class="am-message"><div class="am-alert am-alert-' + type + ' am-radius" id="reg-error-tip">' + message + '</div></div>');
    if (!$('body').find('.am-message').length) {
      alertEle.appendTo($('body'));
    }
    setTimeout(function () {
      $('#reg-error-tip').alert('close');
      $('.am-message').remove();
      if (callback) callback();
    }, 2000)
  }

  self.confirm = function (options) {
    var option={title:"提示",message:"程序员太傻，忘记输入提示内容啦……",callback:function(){}}

      if(typeof(options)=="string"){
        option.message=options
      }else{
        option=$.extend(option,options);
      }
      var top=$(window).height()*0.3;
      $('body').append('<div class="myModa"><div class="myAlertBox" style="margin-top:'+top+'px"><h6>'+option.title+'</h6><p>'+option.message+'</p><div class="col2"><div class="col" style="margin-right: 20px;"><div class="btn exit">取消</div></div><div class="col"><div class="btn sure">确定</div></div></div></div></div>');
      $('.btn.exit').click(function(){
        $('.myModa').remove();
      })
      $('.btn.sure').click(function(){
        $('.myModa').remove();
        option.callback();
      })
  }

  /**
   * 格式化数字
   * @param num 要格式化的值
   * @param ext 格式化后的小数位
   * @returns {*}
   */
  self.number_format = function (num, ext) {
    if (ext < 0) {
      return num;
    }
    num = Number(num);
    if (isNaN(num)) {
      num = 0;
    }
    var _str = num.toString();
    var _arr = _str.split('.');
    var _int = _arr[0];
    var _flt = _arr[1];
    if (_str.indexOf('.') == -1) {
      /* 找不到小数点，则添加 */
      if (ext == 0) {
        return _str;
      }
      var _tmp = '';
      for (var i = 0; i < ext; i++) {
        _tmp += '0';
      }
      _str = _str + '.' + _tmp;
    } else {
      if (_flt.length == ext) {
        return _str;
      }
      /* 找得到小数点，则截取 */
      if (_flt.length > ext) {
        _str = _str.substr(0, _str.length - (_flt.length - ext));
        if (ext == 0) {
          _str = _int;
        }
      } else {
        for (var i = 0; i < ext - _flt.length; i++) {
          _str += '0';
        }
      }
    }
    return _str;
  }


  return self
}(app || {});

module.exports = app;
