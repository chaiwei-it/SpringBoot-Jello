// ydui
var YDUI = (function () {

  "use strict";

  var doc = window.document,
    ydui = {}

  /**
   * 判断css3动画是否执行完毕
   * @git http://blog.alexmaccaw.com/css-transitions
   * @param duration
   */
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false,
      $el = this;

    $(this).one('webkitTransitionEnd', function () {
      called = true;
    });

    var callback = function () {
      if (!called) $($el).trigger('webkitTransitionEnd');
    };

    setTimeout(callback, duration);
  };


  /**
   * HTML5存储
   */
  function storage(ls) {
    return {
      set: function (key, value) {
        ls.setItem(key, util.serialize(value));
      },
      get: function (key) {
        return util.deserialize(ls.getItem(key));
      },
      remove: function (key) {
        ls.removeItem(key);
      },
      clear: function () {
        ls.clear();
      }
    };
  }

  ydui.util = {
    /**
     * 格式化参数
     * @param string
     */
    parseOptions: function (string) {
      if ($.isPlainObject(string)) {
        return string;
      }

      var start = (string ? string.indexOf('{') : -1),
        options = {};

      if (start != -1) {
        try {
          options = (new Function('', 'var json = ' + string.substr(start) + '; return JSON.parse(JSON.stringify(json));'))();
        } catch (e) {}
      }
      return options;
    },
    /**
     * 页面滚动方法【移动端】
     * @type {{lock, unlock}}
     * lock：禁止页面滚动, unlock：释放页面滚动
     */
    pageScroll: function () {
      var fn = function (e) {
        e.preventDefault();
        e.stopPropagation();
      };
      var islock = false;

      return {
        lock: function () {
          if (islock) return;
          islock = true;
          doc.addEventListener('touchmove', fn);
        },
        unlock: function () {
          islock = false;
          doc.removeEventListener('touchmove', fn);
        }
      };
    }(),
    /**
     * 本地存储
     */
    localStorage: function () {
      return storage(window.localStorage);
    }(),
    /**
     * Session存储
     */
    sessionStorage: function () {
      return storage(window.sessionStorage);
    }(),
    /**
     * 序列化
     * @param value
     * @returns {string}
     */
    serialize: function (value) {
      if (typeof value === 'string') return value;
      return JSON.stringify(value);
    },
    /**
     * 反序列化
     * @param value
     * @returns {*}
     */
    deserialize: function (value) {
      if (typeof value !== 'string') return undefined;
      try {
        return JSON.parse(value);
      } catch (e) {
        return value || undefined;
      }
    },
    /**
     * 日期格式化
     * @param format 日期格式 {%d天}{%h时}{%m分}{%s秒}{%f毫秒}
     * @param time 单位 毫秒
     * @returns {string}
     */
    timestampTotime: function (format, time) {
      var t = {},
        floor = Math.floor;

      t.f = time % 1000;
      time = floor(time / 1000);
      t.s = time % 60;
      time = floor(time / 60);
      t.m = time % 60;
      time = floor(time / 60);
      t.h = time % 24;
      t.d = floor(time / 24);

      var ment = function (a) {
        if (a <= 0) {
          return '';
        }
        return '$1' + (a < 10 ? '0' + a : a) + '$2';
      };

      format = format.replace(/\{([^{]*?)%d(.*?)\}/g, ment(t.d));
      format = format.replace(/\{([^{]*?)%h(.*?)\}/g, ment(t.h));
      format = format.replace(/\{([^{]*?)%m(.*?)\}/g, ment(t.m));
      format = format.replace(/\{([^{]*?)%s(.*?)\}/g, ment(t.s));
      format = format.replace(/\{([^{]*?)%f(.*?)\}/g, ment(t.f));

      return format;
    },
    /**
     * js倒计时
     * @param format 时间格式 {%d}天{%h}时{%m}分{%s}秒{%f}毫秒
     * @param time 结束时间时间戳 毫秒
     * @param speed 速度
     * @param callback ret 倒计时结束回调函数 ret 时间字符 ；ret == '' 则倒计时结束
     * DEMO: YDUI.util.countdown('{%d天}{%h时}{%m分}{%s秒}{%f毫秒}', Date.parse(new Date()) + 60000, 1000, function(ret){ console.log(ret); });
     */
    countdown: function (format, time, speed, callback) {
      var that = this;
      var timer = setInterval(function () {
        var l_time = time - new Date().getTime();
        if (l_time > 0) {
          callback(that.timestampTotime(format, l_time));
        } else {
          clearInterval(timer);
          typeof callback == 'function' && callback('');
        }
      }, speed);
    },
    /**
     * js 加减乘除
     * @param arg1 数值1
     * @param op 操作符string 【+ - * /】
     * @param arg2 数值2
     * @returns {Object} arg1 与 arg2运算的精确结果
     */
    calc: function (arg1, op, arg2) {
      var ra = 1,
        rb = 1,
        m;

      try {
        ra = arg1.toString().split('.')[1].length;
      } catch (e) {}
      try {
        rb = arg2.toString().split('.')[1].length;
      } catch (e) {}
      m = Math.pow(10, Math.max(ra, rb));

      switch (op) {
        case '+':
        case '-':
          arg1 = Math.round(arg1 * m);
          arg2 = Math.round(arg2 * m);
          break;
        case '*':
          ra = Math.pow(10, ra);
          rb = Math.pow(10, rb);
          m = ra * rb;
          arg1 = Math.round(arg1 * ra);
          arg2 = Math.round(arg2 * rb);
          break;
        case '/':
          arg1 = Math.round(arg1 * m);
          arg2 = Math.round(arg2 * m);
          m = 1;
          break;
      }
      try {
        var result = eval('(' + '(' + arg1 + ')' + op + '(' + arg2 + ')' + ')/' + m);
      } catch (e) {}
      return result;
    },
    /**
     * 读取图片文件 并返回图片的DataUrl
     * @param obj
     * @param callback
     */
    getImgBase64: function (obj, callback) {
      var that = this,
        dataimg = '',
        file = obj.files[0];
      if (!file) return;
      if (!/image\/\w+/.test(file.type)) {
        that.tipMes('请上传图片文件', 'error');
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        dataimg = this.result;
        typeof callback === 'function' && callback(dataimg);
      };
    },

    /**
     * 获取地址栏参数
     * @param name
     * @returns {*}
     */
    getQueryString: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
        r = window.location.search.substr(1).match(reg),
        qs = '';
      if (r != null) qs = decodeURIComponent(r[2]);
      return qs;
    },
    /**
     * Cookie
     * @type {{get, set}}
     */
    cookie: function () {
      return {
        /**
         * 获取 Cookie
         * @param  {String} name
         * @return {String}
         */
        get: function (name) {
          var m = doc.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
          return (m && m[1]) ? decodeURIComponent(m[1]) : '';
        },
        /**
         * 设置 Cookie
         * @param {String}  name 名称
         * @param {String}  val 值
         * @param {Number} expires 单位（秒）
         * @param {String}  domain 域
         * @param {String}  path 所在的目录
         * @param {Boolean} secure 跨协议传递
         */
        set: function (name, val, expires, domain, path, secure) {
          var text = String(encodeURIComponent(val)),
            date = expires;

          // 从当前时间开始，多少小时后过期
          if (typeof date === 'number') {
            date = new Date();
            date.setTime(date.getTime() + expires * 1000);
          }

          date instanceof Date && (text += '; expires=' + date.toUTCString());

          !!domain && (text += '; domain=' + domain);

          text += '; path=' + (path || '/');

          secure && (text += '; secure');

          doc.cookie = name + '=' + text;
        }
      }
    }()
  };

  // device
  var ua = window.navigator && window.navigator.userAgent || '';
  var ipad = !!ua.match(/(iPad).*OS\s([\d_]+)/),
    ipod = !!ua.match(/(iPod)(.*OS\s([\d_]+))?/),
    iphone = !ipad && !!ua.match(/(iPhone\sOS)\s([\d_]+)/);

  ydui.device = {
    /**
     * 是否移动终端
     * @return {Boolean}
     */
    isMobile: !!ua.match(/AppleWebKit.*Mobile.*/) || 'ontouchstart' in doc.documentElement,
    /**
     * 是否IOS终端
     * @returns {boolean}
     */
    isIOS: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    /**
     * 是否Android终端
     * @returns {boolean}
     */
    isAndroid: !!ua.match(/(Android);?[\s\/]+([\d.]+)?/),
    /**
     * 是否ipad终端
     * @returns {boolean}
     */
    isIpad: ipad,
    /**
     * 是否ipod终端
     * @returns {boolean}
     */
    isIpod: ipod,
    /**
     * 是否iphone终端
     * @returns {boolean}
     */
    isIphone: iphone,
    /**
     * 是否webview
     * @returns {boolean}
     */
    isWebView: (iphone || ipad || ipod) && !!ua.match(/.*AppleWebKit(?!.*Safari)/i),
    /**
     * 是否微信端
     * @returns {boolean}
     */
    isWeixin: ua.indexOf('MicroMessenger') > -1,
    /**
     * 是否火狐浏览器
     */
    isMozilla: /firefox/.test(navigator.userAgent.toLowerCase()),
    /**
     * 设备像素比
     */
    pixelRatio: window.devicePixelRatio || 1
  };

  /**
   * Dialog
   */
  "use strict";

  var dialog = ydui.dialog = ydui.dialog || {},
    $body = $(window.document.body);

  /**
   * 确认提示框
   * @param title 标题String 【可选】
   * @param mes   内容String 【必填】
   * @param opts  按钮们Array 或 “确定按钮”回调函数Function 【必填】
   * @constructor
   */
  dialog.confirm = function (title, mes, opts) {
    var ID = 'YDUI_CONFRIM';

    $('#' + ID).remove();

    var args = arguments.length;
    if (args < 2) {
      console.error('From YDUI\'s confirm: Please set two or three parameters!!!');
      return;
    }

    if (typeof arguments[1] != 'function' && args == 2 && !arguments[1] instanceof Array) {
      console.error('From YDUI\'s confirm: The second parameter must be a function or array!!!');
      return;
    }

    if (args == 2) {
      opts = mes;
      mes = title;
      title = '提示';
    }

    var btnArr = opts;
    if (typeof opts === 'function') {
      btnArr = [{
        txt: '取消',
        color: false
      }, {
        txt: '确定',
        color: true,
        callback: function () {
          opts && opts();
        }
      }];
    }

    var $dom = $('' +
      '<div class="mask-black-dialog" id="' + ID + '">' +
      '   <div class="m-confirm">' +
      '       <div class="confirm-hd"><strong class="confirm-title">' + title + '</strong></div>' +
      '       <div class="confirm-bd">' + mes + '</div>' +
      '   </div>' +
      '</div>');

    // 遍历按钮数组
    var $btnBox = $('<div class="confirm-ft"></div>');

    $.each(btnArr, function (i, val) {
      var $btn;
      // 指定按钮颜色
      if (typeof val.color == 'boolean') {
        $btn = $('<a href="javascript:;" class="' + 'confirm-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
      } else if (typeof val.color == 'string') {
        $btn = $('<a href="javascript:;" style="color: ' + val.color + '">' + (val.txt || '') + '</a>');
      }

      // 给对应按钮添加点击事件
      (function (p) {
        $btn.on('click', function (e) {
          e.stopPropagation();

          // 是否保留弹窗
          if (!btnArr[p].stay) {
            // 释放页面滚动
            ydui.util.pageScroll.unlock();
            $dom.remove();
          }
          btnArr[p].callback && btnArr[p].callback();
        });
      })(i);
      $btnBox.append($btn);
    });

    $dom.find('.m-confirm').append($btnBox);

    // 禁止滚动屏幕【移动端】
    ydui.util.pageScroll.lock();

    $body.append($dom);
  };

  /**
   * 弹出警示框
   * @param mes       提示文字String 【必填】
   * @param callback  回调函数Function 【可选】
   */
  dialog.alert = function (mes, callback) {

    var ID = 'YDUI_ALERT';

    $('#' + ID).remove();

    var $dom = $('' +
      '<div id="' + ID + '">' +
      '   <div class="mask-black-dialog">' +
      '       <div class="m-confirm m-alert">' +
      '           <div class="confirm-bd">' + (mes || 'YDUI Touch') + '</div>' +
      '           <div class="confirm-ft">' +
      '               <a href="javascript:;" class="confirm-btn primary">确定</a>' +
      '           </div>' +
      '       </div>' +
      '   </div>' +
      '</div>');

    ydui.util.pageScroll.lock();

    $body.append($dom);

    $dom.find('a').on('click', function () {
      $dom.remove();
      ydui.util.pageScroll.unlock();
      typeof callback === 'function' && callback();
    });
  };

  /**
   * 弹出提示层
   */
  dialog.toast = function () {
    var timer = null;
    /**
     * @param mes       提示文字String 【必填】
     * @param type      类型String success or error 【必填】
     * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
     * @param callback  回调函数Function 【可选】
     */
    return function (mes, type, timeout, callback) {

      clearTimeout(timer);

      var ID = 'YDUI_TOAST';

      $('#' + ID).remove();

      var args = arguments.length;
      if (args < 2) {
        console.error('From YDUI\'s toast: Please set two or more parameters!!!');
        return;
      }

      var iconHtml = '';
      if (type == 'success' || type == 'error') {
        iconHtml = '<div class="' + (type == 'error' ? 'toast-error-ico' : 'toast-success-ico') + '"></div>';
      }

      var $dom = $('' +
        '<div class="mask-white-dialog" id="' + ID + '">' +
        '    <div class="m-toast ' + (iconHtml == '' ? 'none-icon' : '') + '">' + iconHtml +
        '        <p class="toast-content">' + (mes || '') + '</p>' +
        '    </div>' +
        '</div>');

      ydui.util.pageScroll.lock();

      $body.append($dom);

      if (typeof timeout === 'function' && arguments.length >= 3) {
        callback = timeout;
        timeout = 2000;
      }

      timer = setTimeout(function () {
        clearTimeout(timer);
        ydui.util.pageScroll.unlock();
        $dom.remove();
        typeof callback === 'function' && callback();
      }, (~~timeout || 2000) + 100); //100为动画时间
    };
  }();

  /**
   * 顶部提示层
   */
  dialog.notify = function () {

    var timer = null;

    /**
     * @param mes       提示文字String 【必填】
     * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
     */
    return function (mes, timeout, callback) {

      clearTimeout(timer);

      var ID = 'YDUI_NOTIFY';

      $('#' + ID).remove();

      var $dom = $('<div id="' + ID + '"><div class="m-notify">' + (mes || '') + '</div></div>');

      $body.append($dom);

      var next = function () {
        $dom.remove();
        typeof callback == 'function' && callback();
      };

      var closeNotify = function () {
        clearTimeout(timer);

        $dom.find('.m-notify').addClass('notify-out');

        $dom.one('webkitTransitionEnd', next).emulateTransitionEnd(150);
      };

      $dom.on('click', closeNotify);

      if (~~timeout > 0) {
        timer = setTimeout(closeNotify, timeout + 200);
      }
    }
  }();

  /**
   * 加载中提示框
   */
  dialog.loading = function () {

    var ID = 'YDUI_LOADING';

    return {
      /**
       * 加载中 - 显示
       * @param text 显示文字String 【可选】
       */
      open: function (text) {
        $('#' + ID).remove();

        var $dom = $('' +
          '<div class="mask-white-dialog" id="' + ID + '">' +
          '   <div class="m-loading">' +
          '       <div class="loading-icon"></div>' +
          '       <div class="loading-txt">' + (text || '数据加载中') + '</div>' +
          '   </div>' +
          '</div>').remove();

        ydui.util.pageScroll.lock();
        $body.append($dom);
      },
      /**
       * 加载中 - 隐藏
       */
      close: function () {
        ydui.util.pageScroll.unlock();
        $('#' + ID).remove();
      }
    };
  }();


  return {
    util: ydui.util,
    device: ydui.device,
    dialog: ydui.dialog
  }
})()

window.YDUI = YDUI
module.exports = YDUI;
