window.$ = jQuery = require("jquery")
var _ = require('lodash');
require('ydui/flexible.js')
require('ydui/ydui.citys.js')
require('ydui')
require('ydui/methods.js')
// var attachFastClick =
var color = 'color:rgb(66, 185, 131)';
var switchs = false;
var app = function (self) {
  /**
   *  页面加载完显示
   *  @param return
   */
  self.init = function () {
    $("html").show()
    require('fastclick')(document.body)
  };

  /**
   *  api
   *  @param return
   */
  self.api = require('./api.js');
  /**
   *  UI框架
   *  @param {Function} url         对象方法
   *  @param return
   */
  self.ui = YDUI

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
    // // is Zepto Object
    // if (Zepto.zepto.isZ(element)) {
    //   compiled = _.template(element.html());
    // }
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
    if (switchs) {
      console.log('%c接口: ' + url, color);
      console.log('%c类型: ' + type, color);
      console.log('%c参数: ' + JSON.stringify(param), color);
    }
    $.ajax({
      url: url,
      type: type,
      data: param,
      contentType: 'application/x-www-form-urlencoded',
      timeout: 10000,
      dataType: 'json',
      beforeSend: function () {
        YDUI.dialog.loading.open("正在加载..")
      },
      success: function (data) {
        try {
          if (switchs) console.info('🙄成功返回==>', data)
          callback(data)
        } catch (e) {
          if (switchs) console.error(e)
        }
      },
      complete: function () {
        YDUI.dialog.loading.close()
      },
      error: function (xhr, e) {
        if (switchs) console.error(xhr.statusText);
        if (xhr.statusText == "timeout") {
          YDUI.dialog.notify("请求超时请重试", 2000)
        }
      }
    });
  }

  return self
}(app || {});
app.init()
module.exports = app;
