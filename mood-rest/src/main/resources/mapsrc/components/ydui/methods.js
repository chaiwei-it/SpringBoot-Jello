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
 * ActionSheet Plugin
 */
! function (window) {
  "use strict";

  var doc = window.document,
    $doc = $(doc),
    $body = $(doc.body),
    $mask = $('<div class="mask-black"></div>');

  function ActionSheet(element, closeElement) {
    this.$element = $(element);
    this.closeElement = closeElement;
    this.toggleClass = 'actionsheet-toggle';
  }

  ActionSheet.prototype.open = function () {

    YDUI.device.isIOS && $('.g-scrollview').addClass('g-fix-ios-overflow-scrolling-bug');

    var _this = this;
    $body.append($mask);

    // 点击遮罩层关闭窗口
    $mask.on('click.ydui.actionsheet.mask', function () {
      _this.close();
    });

    // 第三方关闭窗口操作
    if (_this.closeElement) {
      $doc.on('click.ydui.actionsheet', _this.closeElement, function () {
        _this.close();
      });
    }

    _this.$element.addClass(_this.toggleClass).trigger('open.ydui.actionsheet');
  };

  ActionSheet.prototype.close = function () {
    var _this = this;

    YDUI.device.isIOS && $('.g-scrollview').removeClass('g-fix-ios-overflow-scrolling-bug');

    $mask.off('click.ydui.actionsheet.mask').remove();
    _this.$element.removeClass(_this.toggleClass).trigger('close.ydui.actionsheet');
    //$doc.off('click.ydui.actionsheet', _this.closeElement);
  };

  function Plugin(option) {
    var args = Array.prototype.slice.call(arguments, 1);

    return this.each(function () {
      var $this = $(this),
        actionsheet = $this.data('ydui.actionsheet');

      if (!actionsheet) {
        $this.data('ydui.actionsheet', (actionsheet = new ActionSheet(this, option.closeElement)));
        if (!option || typeof option == 'object') {
          actionsheet.open();
        }
      }

      if (typeof option == 'string') {
        actionsheet[option] && actionsheet[option].apply(actionsheet, args);
      }
    });
  }

  $doc.on('click.ydui.actionsheet.data-api', '[data-ydui-actionsheet]', function (e) {
    e.preventDefault();

    var options = window.YDUI.util.parseOptions($(this).data('ydui-actionsheet')),
      $target = $(options.target),
      option = $target.data('ydui.actionsheet') ? 'open' : options;

    Plugin.call($target, option);
  });

  $.fn.actionSheet = Plugin;

}(window);

/**
 * 解决:active这个高端洋气的CSS伪类不能使用问题
 */
! function (window) {
  window.document.addEventListener('touchstart', function (event) {
    /* Do Nothing */
  }, false);
}(window);

/**
 * CitySelect Plugin
 */
! function (window) {
  "use strict";

  var $body = $(window.document.body);

  function CitySelect(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, CitySelect.DEFAULTS, options || {});
    this.init();
  }

  CitySelect.DEFAULTS = {
    provance: '',
    city: ''
  };

  CitySelect.prototype.init = function () {
    var _this = this,
      options = _this.options;

    if (typeof YDUI_CITYS == 'undefined') {
      console.error('请在ydui.js前引入ydui.citys.js。下载地址：http://cityselect.ydui.org');
      return;
    }

    _this.citys = YDUI_CITYS;

    _this.createDOM();

    _this.defaultSet = {
      provance: options.provance,
      city: options.city
    };
  };

  CitySelect.prototype.open = function () {
    var _this = this;

    $body.append(_this.$mask);

    // 防止火狐浏览器文本框丑丑的一坨小水滴
    YDUI.device.isMozilla && _this.$element.blur();

    _this.$mask.on('click.ydui.cityselect.mask', function () {
      _this.close();
    });

    var $cityElement = _this.$cityElement,
      defaultSet = _this.defaultSet;

    $cityElement.find('.cityselect-content').removeClass('cityselect-move-animate cityselect-next cityselect-prev');

    _this.loadProvance();

    if (defaultSet.provance) {
      _this.setNavTxt(0, defaultSet.provance);
    } else {
      $cityElement.find('.cityselect-nav a').eq(0).addClass('crt').html('请选择');
    }

    if (defaultSet.city) {
      _this.loadCity();
      // _this.setNavTxt(1, defaultSet.city)
    }

    // if (defaultSet.area) {
    //   _this.loadArea();
    //   _this.ForwardView(false);
    //   _this.setNavTxt(2, defaultSet.area);
    // }

    $cityElement.addClass('brouce-in');
  };

  CitySelect.prototype.close = function () {
    var _this = this;

    _this.$mask.remove();
    _this.$cityElement.removeClass('brouce-in').find('.cityselect-nav a').removeClass('crt').html('');
    _this.$itemBox.html('');
  };

  CitySelect.prototype.createDOM = function () {
    var _this = this;

    _this.$mask = $('<div class="mask-black"></div>');

    _this.$cityElement = $('' +
      '<div class="m-cityselect">' +
      '    <div class="cityselect-header">' +
      '        <p class="cityselect-title">所在地区</p>' +
      '        <div class="cityselect-nav">' +
      '            <a href="javascript:;" ></a>' +
      '            <a href="javascript:;"></a>' +
      '            <a href="javascript:;"></a>' +
      '        </div>' +
      '    </div>' +
      '    <ul class="cityselect-content">' +
      '        <li class="cityselect-item">' +
      '            <div class="cityselect-item-box"></div>' +
      '        </li>' +
      '        <li class="cityselect-item">' +
      '            <div class="cityselect-item-box"></div>' +
      '        </li>' +
      '        <li class="cityselect-item">' +
      '            <div class="cityselect-item-box"></div>' +
      '        </li>' +
      '    </ul>' +
      '</div>');

    $body.append(_this.$cityElement);

    _this.$itemBox = _this.$cityElement.find('.cityselect-item-box');

    _this.$cityElement.on('click.ydui.cityselect', '.cityselect-nav a', function () {
      var $this = $(this);

      $this.addClass('crt').siblings().removeClass('crt');

      $this.index() < 2 ? _this.backOffView() : _this.ForwardView(true);
    });
  };

  CitySelect.prototype.setNavTxt = function (index, txt) {

    var $nav = this.$cityElement.find('.cityselect-nav a');

    index < 2 && $nav.removeClass('crt');

    $nav.eq(index).html(txt);
    $nav.eq(index + 1).addClass('crt').html('请选择');
    $nav.eq(index + 2).removeClass('crt').html('');
  };

  CitySelect.prototype.backOffView = function () {
    this.$cityElement.find('.cityselect-content').removeClass('cityselect-next')
      .addClass('cityselect-move-animate cityselect-prev');
  };

  CitySelect.prototype.ForwardView = function (animate) {
    this.$cityElement.find('.cityselect-content').removeClass('cityselect-move-animate cityselect-prev')
      .addClass((animate ? 'cityselect-move-animate' : '') + ' cityselect-next');
  };

  CitySelect.prototype.bindItemEvent = function () {
    var _this = this,
      $cityElement = _this.$cityElement;

    $cityElement.on('click.ydui.cityselect', '.cityselect-item-box a', function () {
      var $this = $(this);

      if ($this.hasClass('crt')) return;
      $this.addClass('crt').siblings().removeClass('crt');

      var tag = $this.data('tag');

      _this.setNavTxt(tag, $this.text());

      var $nav = $cityElement.find('.cityselect-nav a'),
        defaultSet = _this.defaultSet;

      if (tag == 0) {

        _this.loadCity();
        $cityElement.find('.cityselect-item-box').eq(1).find('a').removeClass('crt');

      } else if (tag == 1) {

        defaultSet.provance = $nav.eq(0).html();
        defaultSet.city = $nav.eq(1).html();
        defaultSet.area = $nav.eq(2).html();

        _this.returnValue();
        // 不选三级
        // _this.loadArea();
        // _this.ForwardView(true);
        // $cityElement.find('.cityselect-item-box').eq(2).find('a').removeClass('crt');
        // _this.returnValue();
      }
    });
  };

  CitySelect.prototype.returnValue = function () {
    var _this = this,
      defaultSet = _this.defaultSet;

    _this.$element.trigger($.Event('done.ydui.cityselect', {
      provance: defaultSet.provance,
      city: defaultSet.city,
      area: defaultSet.area
    }));

    _this.close();
  };

  CitySelect.prototype.scrollPosition = function (index) {

    var _this = this,
      $itemBox = _this.$itemBox.eq(index),
      itemHeight = $itemBox.find('a.crt').height(),
      itemBoxHeight = $itemBox.parent().height();

    $itemBox.parent().animate({
      scrollTop: $itemBox.find('a.crt').index() * itemHeight - itemBoxHeight / 3
    }, 0, function () {
      _this.bindItemEvent();
    });
  };

  CitySelect.prototype.fillItems = function (index, arr) {
    var _this = this;

    _this.$itemBox.eq(index).html(arr).parent().animate({ scrollTop: 0 }, 10);

    _this.scrollPosition(index);
  };

  CitySelect.prototype.loadProvance = function () {
    var _this = this;

    var arr = [];
    $.each(_this.citys, function (k, v) {
      arr.push($('<a class="' + (v.n == _this.defaultSet.provance ? 'crt' : '') + '" href="javascript:;"><span>' + v.n + '</span></a>').data({
        citys: v.c,
        tag: 0
      }));
    });
    _this.fillItems(0, arr);
  };

  CitySelect.prototype.loadCity = function () {
    var _this = this;

    var cityData = _this.$itemBox.eq(0).find('a.crt').data('citys');

    var arr = [];
    $.each(cityData, function (k, v) {
      arr.push($('<a class="' + (v.n == _this.defaultSet.city ? 'crt' : '') + '" href="javascript:;"><span>' + v.n + '</span></a>').data({
        citys: v.a,
        tag: 1
      }));
    });
    _this.fillItems(1, arr);
  };

  CitySelect.prototype.loadArea = function () {
    var _this = this;

    var areaData = _this.$itemBox.eq(1).find('a.crt').data('citys');

    var arr = [];
    $.each(areaData, function (k, v) {
      arr.push($('<a class="' + (v == _this.defaultSet.area ? 'crt' : '') + '" href="javascript:;"><span>' + v + '</span></a>').data({ tag: 2 }));
    });

    if (arr.length <= 0) {
      arr.push($('<a href="javascript:;"><span>全区</span></a>').data({ tag: 2 }));
    }
    _this.fillItems(2, arr);
  };

  function Plugin(option) {
    var args = Array.prototype.slice.call(arguments, 1);

    return this.each(function () {
      var $this = $(this),
        citySelect = $this.data('ydui.cityselect');

      if (!citySelect) {
        $this.data('ydui.cityselect', (citySelect = new CitySelect(this, option)));
      }

      if (typeof option == 'string') {
        citySelect[option] && citySelect[option].apply(citySelect, args);
      }
    });
  }

  $.fn.citySelect = Plugin;

}(window);


/**
 * InfiniteScroll Plugin
 */
! function (window) {
  "use strict";

  var util = window.YDUI.util;

  function InfiniteScroll(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, InfiniteScroll.DEFAULTS, options || {});
    this.init();
  }

  /**
   * 默认参数
   */
  InfiniteScroll.DEFAULTS = {
    binder: window, // 绑定浏览器滚动事件DOM
    initLoad: true, // 是否初始化加载第一屏数据
    pageSize: 0, // 每页请求的数据量
    loadingHtml: '加载中...', // 加载中提示，支持HTML
    doneTxt: '没有更多数据了', // 加载完毕提示
    backposition: false, // 是否从详情页返回列表页重新定位之前位置
    jumpLink: '', // 跳转详情页链接元素
    loadListFn: null, // 加载数据方法
    loadStorageListFn: null // 加载SesstionStorage数据方法
  };

  /**
   * 初始化
   */
  InfiniteScroll.prototype.init = function () {
    var _this = this,
      options = _this.options,
      _location = window.location;

    if (~~options.pageSize <= 0) {
      console.error('[YDUI warn]: 需指定pageSize参数【即每页请求数据的长度】');
      return;
    }

    // 获取页面唯一键，防止多个页面调用数据错乱
    var primaryKey = _location.pathname.toUpperCase().replace(/\/?\.?/g, '');
    if (!primaryKey) {
      primaryKey = 'YDUI_' + _location.host.toUpperCase().replace(/\/?\.?:?/g, '');
    }

    // 保存返回页面定位所需参数的键名
    _this.backParamsKey = primaryKey + '_BACKPARAMS';
    // 保存列表数据的键名
    _this.backParamsListKey = primaryKey + '_LIST_';

    // 在列表底部添加一个标记，用其判断是否滚动至底部
    _this.$element.append(_this.$tag = $('<div class="J_InfiniteScrollTag"></div>'));

    // 初始化赋值列表距离顶部的距离(比如去除导航的高度距离)，用以返回列表定位准确位置
    _this.listOffsetTop = _this.$element.offset().top;

    _this.initLoadingTip();

    // 是否初始化就需要加载第一屏数据
    if (options.initLoad) {
      if (!options.backposition) {
        _this.loadList();
      } else {
        // !util.localStorage.get(_this.backParamsKey) && _this.loadList();
        !util.sessionStorage.get(_this.backParamsKey) && _this.loadList();
      }
    }

    _this.bindScrollEvent();

    if (options.backposition) {
      _this.loadListFromStorage();

      _this.bindLinkEvent();
    }
  };

  /**
   * 初始化加载中提示
   */
  InfiniteScroll.prototype.initLoadingTip = function () {
    var _this = this;

    _this.$element.append(_this.$loading = $('<div class="list-loading">' + _this.options.loadingHtml + '</div>'));
  };

  /**
   * 滚动页面至SesstionStorage储存的坐标
   */
  InfiniteScroll.prototype.scrollPosition = function () {
    var _this = this,
      options = _this.options,
      $binder = $(options.binder);

    var backParams = util.sessionStorage.get(_this.backParamsKey);

    // 滚动页面
    backParams && $binder.stop().animate({ scrollTop: backParams.offsetTop }, 0, function () {
      _this.scrolling = false;
    });

    options.backposition && _this.bindLinkEvent();

    // 释放页面滚动权限
    util.pageScroll.unlock();

    // 删除保存坐标页码的存储
    util.sessionStorage.remove(_this.backParamsKey);
  };

  /**
   * 给浏览器绑定滚动事件
   */
  InfiniteScroll.prototype.bindScrollEvent = function () {
    var _this = this,
      $binder = $(_this.options.binder),
      isWindow = $binder.get(0) === window,
      contentHeight = isWindow ? $(window).height() : $binder.height();

    $binder.on('scroll.ydui.infinitescroll', function () {

      if (_this.loading || _this.isDone) return;

      var contentTop = isWindow ? $(window).scrollTop() : $binder.offset().top;

      // 当浏览器滚动到底部时，此时 _this.$tag.offset().top 等于 contentTop + contentHeight
      if (_this.$tag.offset().top <= contentTop + contentHeight + contentHeight / 10) {
        _this.loadList();
      }
    });
  };

  /**
   * 跳转详情页前处理操作
   * description: 点击跳转前储存当前位置以及页面，之后再跳转
   */
  InfiniteScroll.prototype.bindLinkEvent = function () {
    var _this = this,
      options = _this.options;

    if (!options.jumpLink) {
      console.error('[YDUI warn]: 需指定跳转详情页链接元素');
      return;
    }

    $(_this.options.binder).on('click.ydui.infinitescroll', _this.options.jumpLink, function (e) {
      e.preventDefault();

      var $this = $(this),
        page = $this.data('page');

      if (!page) {
        console.error('[YDUI warn]: 跳转链接元素需添加属性[data-page="其所在页码"]');
        return;
      }

      // 储存top[距离顶部的距离]与page[页码]
      util.sessionStorage.set(_this.backParamsKey, {
        offsetTop: $(_this.options.binder).scrollTop() + $this.offset().top - _this.listOffsetTop,
        page: page
      });

      location.href = $this.attr('href');
    });
  };

  /**
   * 加载数据
   */
  InfiniteScroll.prototype.loadList = function () {
    var _this = this,
      options = _this.options;

    _this.loading = true;
    _this.$loading.show();

    if (typeof options.loadListFn == 'function') {

      // 监听外部获取数据方法，以便获取数据
      options.loadListFn().done(function (listArr, page) {
        var len = listArr.length;

        if (~~len <= 0) {
          console.error('[YDUI warn]: 需在 resolve() 方法里回传本次获取记录集合');
          return;
        }

        // 当请求的数据小于pageSize[每页请求数据数]，则认为数据加载完毕，提示相应信息
        if (len < options.pageSize) {
          _this.$element.append('<div class="list-donetip">' + options.doneTxt + '</div>');
          _this.isDone = true;
        }
        _this.$loading.hide();
        _this.loading = false;

        // 将请求到的数据存入SessionStorage
        if (options.backposition) {
          util.sessionStorage.set(_this.backParamsListKey + page, listArr);
        }
      });
    }
  };

  /**
   * 从SessionStorage取出数据
   */
  InfiniteScroll.prototype.loadListFromStorage = function () {
    var _this = this,
      storage = util.sessionStorage.get(_this.backParamsKey);

    if (!storage) return;

    // 锁定页面禁止滚动
    util.pageScroll.lock();

    // 总需滚动的页码数
    var pageTotal = storage.page;

    var listArr = [];

    // 根据页码从Storage获取数据所需数据
    for (var i = 1; i <= pageTotal; i++) {
      var _list = util.sessionStorage.get(_this.backParamsListKey + i);

      listArr.push({
        page: i,
        list: _list
      });

      // 判断跳转前数据是否加载完毕
      if (i == pageTotal && _list.length < _this.options.pageSize) {
        _this.$element.append('<div class="list-donetip">' + _this.options.doneTxt + '</div>');
        _this.$loading.hide();
        _this.loading = false;
        _this.isDone = true;
      }
    }

    // 将数据传出外部方法，直至其通知已插入页面后滚动至相应位置
    _this.options.loadStorageListFn(listArr, pageTotal + 1).done(function () {
      _this.scrollPosition();
    });
  };

  function Plugin(option) {
    return this.each(function () {
      new InfiniteScroll(this, option);
    });
  }

  $.fn.infiniteScroll = Plugin;

}(window);

/**
 * KeyBoard Plugin
 */
! function (window) {
  "use strict";

  var $body = $(window.document.body),
    isMobile = !!(window.navigator && window.navigator.userAgent || '').match(/AppleWebKit.*Mobile.*/) || 'ontouchstart' in window.document.documentElement,
    triggerEvent = isMobile ? 'touchstart' : 'click';

  function KeyBoard(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, KeyBoard.DEFAULTS, options || {});
    this.init();
  }

  KeyBoard.DEFAULTS = {
    disorder: false,
    title: '安全键盘'
  };

  KeyBoard.prototype.init = function () {
    var _this = this;

    _this.inputNums = '';

    _this.toggleClass = 'keyboard-show';

    function getDot() {
      var s = '';
      for (var i = 0; i < 6; i++) {
        s += '<li><i></i></li>';
      }
      return s;
    }

    var hd = '' +
      '<div class="keyboard-head"><strong>输入数字密码</strong></div>' +
      '<div class="keyboard-error"></div>' +
      '<ul class="keyboard-password J_FillPwdBox">' + getDot() + '</ul>';

    var ft = '' +
      '<div class="keyboard-content">' +
      '   <div class="keyboard-title">' + _this.options.title + '</div>' +
      '   <ul class="keyboard-numbers"></ul>' +
      '</div>';

    _this.$element.prepend(hd).append(ft);

    _this.$numsBox = _this.$element.find('.keyboard-numbers');

    _this.$mask = $('<div class="mask-black"></div>');
  };

  /**
   * 打开键盘窗口
   */
  KeyBoard.prototype.open = function () {
    var _this = this,
      $element = _this.$element,
      $numsBox = _this.$numsBox;

    YDUI.device.isIOS && $('.g-scrollview').addClass('g-fix-ios-overflow-scrolling-bug');

    $element.addClass(_this.toggleClass);

    if (_this.options.disorder || $numsBox.data('loaded-nums') != 1) {
      $numsBox.data('loaded-nums', 1).html(_this.createNumsHtml());
    }

    $body.append(_this.$mask);

    _this.bindEvent();
  };

  /**
   * 关闭键盘窗口
   */
  KeyBoard.prototype.close = function () {
    var _this = this;

    YDUI.device.isIOS && $('.g-scrollview').removeClass('g-fix-ios-overflow-scrolling-bug');

    _this.$mask.remove();
    _this.$element.removeClass(_this.toggleClass);
    _this.unbindEvent();

    _this.inputNums = '';
    _this.fillPassword();

    _this.clearError();
  };

  /**
   * 事件绑定
   */
  KeyBoard.prototype.bindEvent = function () {
    var _this = this,
      $element = _this.$element;

    _this.$mask.on(triggerEvent + '.ydui.keyboard.mask', function (e) {
      e.preventDefault();
      _this.close();
    });

    $element.on(triggerEvent + '.ydui.keyboard.nums', '.J_Nums', function (e) {
      if (_this.inputNums.length >= 6) return;

      _this.inputNums = _this.inputNums + $(this).html();

      _this.clearError();
      _this.fillPassword();
    });

    // 退格
    $element.on(triggerEvent + '.ydui.keyboard.backspace', '.J_Backspace', function (e) {
      e.preventDefault();
      _this.backspace();
    });

    // 取消
    $element.on(triggerEvent + '.ydui.keyboard.cancel', '.J_Cancel', function (e) {
      e.preventDefault();
      _this.close();
    });
  };

  /**
   * 解绑事件
   */
  KeyBoard.prototype.unbindEvent = function () {
    this.$element.off(triggerEvent + '.ydui.keyboard');
    $(window).off('hashchange.ydui.keyboard');
  };

  /**
   * 填充密码
   */
  KeyBoard.prototype.fillPassword = function () {
    var _this = this,
      inputNums = _this.inputNums,
      length = inputNums.length;

    var $li = _this.$element.find('.J_FillPwdBox').find('li');
    $li.find('i').hide();
    $li.filter(':lt(' + length + ')').find('i').css('display', 'block');

    if (length >= 6) {
      _this.$element.trigger($.Event('done.ydui.keyboard', {
        password: inputNums
      }));
    }
  };

  /**
   * 清空错误信息
   */
  KeyBoard.prototype.clearError = function () {
    this.$element.find('.keyboard-error').html('');
  };

  /**
   * 提示错误信息
   * @param mes
   */
  KeyBoard.prototype.error = function (mes) {
    var _this = this;
    _this.$element.find('.keyboard-error').html(mes);

    _this.inputNums = '';
    _this.fillPassword();
  };

  /**
   * 退格处理
   */
  KeyBoard.prototype.backspace = function () {
    var _this = this;

    var _inputNums = _this.inputNums;
    if (_inputNums) {
      _this.inputNums = _inputNums.substr(0, _inputNums.length - 1);
    }

    _this.fillPassword();
  };

  /**
   * 创建键盘HTML
   * @returns {string}
   */
  KeyBoard.prototype.createNumsHtml = function () {
    var _this = this,
      nums = _this.createNums();

    _this.options.disorder && _this.upsetOrder(nums);

    var arr = [];
    $.each(nums, function (k) {
      if (k % 3 == 0) {
        if (k >= nums.length - 2) {
          arr.push('<li><a href="javascript:;" class="J_Cancel">取消</a>' + nums.slice(k, k + 3).join('') + '<a href="javascript:;" class="J_Backspace"></a></li>');
        } else {
          arr.push('<li>' + nums.slice(k, k + 3).join('') + '</li>');
        }
      }
    });

    return arr.join('');
  };

  /**
   * 创建键盘数字
   * @returns {Array} DOM数组
   */
  KeyBoard.prototype.createNums = function () {
    var _this = this;
    var disorder = _this.options.disorder;

    if (disorder && _this.cacheNums) {
      return _this.cacheNums;
    }

    var strArr = [];
    for (var i = 1; i <= 10; i++) {
      strArr.push('<a href="javascript:;" class="J_Nums">' + (i % 10) + '</div>');
    }

    if (!disorder) {
      _this.cacheNums = strArr;
    }

    return strArr;
  };

  /**
   * 打乱数组顺序
   * @param arr 数组
   * @returns {*}
   */
  KeyBoard.prototype.upsetOrder = function (arr) {
    var floor = Math.floor,
      random = Math.random,
      len = arr.length,
      i, j, temp,
      n = floor(len / 2) + 1;
    while (n--) {
      i = floor(random() * len);
      j = floor(random() * len);
      if (i !== j) {
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
    return arr;
  };

  function Plugin(option) {
    var args = Array.prototype.slice.call(arguments, 1);

    return this.each(function () {

      var $this = $(this),
        keyboard = $this.data('ydui.keyboard');

      if (!keyboard) {
        $this.data('ydui.keyboard', (keyboard = new KeyBoard(this, option)));
      }

      if (typeof option == 'string') {
        keyboard[option] && keyboard[option].apply(keyboard, args);
      }
    });
  }

  $.fn.keyBoard = Plugin;

}(window);

/**
 * LazyLoad Plugin
 * @example $(selector).find("img").lazyLoad();
 */
! function (window) {
  "use strict";

  function LazyLoad(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, LazyLoad.DEFAULTS, options || {});
    this.init();
  }

  LazyLoad.DEFAULTS = {
    attr: 'data-url',
    binder: window,
    placeholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQIHWN4BQAA7ADrKJeAMwAAAABJRU5ErkJggg=='
  };

  LazyLoad.prototype.init = function () {
    var _this = this;

    _this.bindImgEvent();

    _this.loadImg();

    $(_this.options.binder).on('scroll.ydui.lazyload', function () {
      _this.loadImg();
    });

    $(window).on('resize.ydui.lazyload', function () {
      _this.loadImg();
    });
  };

  /**
   * 加载图片
   */
  LazyLoad.prototype.loadImg = function () {
    var _this = this,
      options = _this.options,
      $binder = $(options.binder);

    var contentHeight = $binder.height(),
      contentTop = $binder.get(0) === window ? $(window).scrollTop() : $binder.offset().top;

    _this.$element.each(function () {
      var $img = $(this);

      var post = $img.offset().top - contentTop,
        posb = post + $img.height();

      // 判断是否位于可视区域内
      if ((post >= 0 && post < contentHeight) || (posb > 0 && posb <= contentHeight)) {
        $img.trigger('appear.ydui.lazyload');
      }
    });
  };

  /**
   * 给所有图片绑定单次自定义事件
   */
  LazyLoad.prototype.bindImgEvent = function () {
    var _this = this,
      options = _this.options;

    _this.$element.each(function () {
      var $img = $(this);

      if ($img.is("img") && !$img.attr("src")) {
        $img.attr("src", options.placeholder);
      }

      $img.one("appear.ydui.lazyload", function () {
        if ($img.is("img")) {
          $img.attr("src", $img.attr(options.attr));
        }
      });
    });
  };

  $.fn.lazyLoad = function (option) {
    new LazyLoad(this, option);
  };

}(window);

/**
 * ProgressBar Plugin
 * Refer to: https://github.com/kimmobrunfeldt/progressbar.js.git
 */
! function (window) {
  "use strict";

  var doc = window.document,
    util = window.YDUI.util;

  function Circle(element, options) {
    this.pathTemplate = 'M 50,50 m 0,-{radius} a {radius},{radius} 0 1 1 0,{2radius} a {radius},{radius} 0 1 1 0,-{2radius}';
    ProgressBar.apply(this, arguments);
  }

  Circle.prototype = new ProgressBar();

  Circle.prototype.getPathString = function (widthOfWider) {
    var _this = this,
      r = 50 - widthOfWider / 2;
    return _this.render(_this.pathTemplate, {
      radius: r,
      '2radius': r * 2
    });
  };

  Circle.prototype.initSvg = function (svg) {
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.display = 'block';
    svg.style.width = '100%';
  };

  function Line(element, options) {
    this.pathTemplate = 'M 0,{center} L 100,{center}';
    ProgressBar.apply(this, arguments);
  }

  Line.prototype = new ProgressBar();

  Line.prototype.getPathString = function (widthOfWider) {
    var _this = this;
    return _this.render(_this.pathTemplate, {
      center: widthOfWider / 2
    });
  };

  Line.prototype.initSvg = function (svg, options) {
    svg.setAttribute('viewBox', '0 0 100 ' + options.strokeWidth);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.width = '100%';
    svg.style.height = '100%';
  };

  function ProgressBar(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, ProgressBar.DEFAULTS, options || {});
  }

  ProgressBar.DEFAULTS = {
    type: 'circle',
    strokeWidth: 0,
    strokeColor: '#E5E5E5',
    trailWidth: 0,
    trailColor: '#646464',
    fill: '',
    progress: 0,
    delay: true,
    binder: window
  };

  ProgressBar.prototype.set = function (progress) {

    var _this = this,
      length = _this.trailPath.getTotalLength();

    if (!progress) progress = _this.options.progress;
    if (progress > 1) progress = 1;

    _this.trailPath.style.strokeDashoffset = length - progress * length;
  };

  ProgressBar.prototype.appendView = function () {
    var _this = this,
      options = _this.options,
      progress = options.progress,
      svgView = _this.createSvgView(),
      $element = _this.$element;

    _this.$binder = options.binder === window || options.binder == 'window' ? $(window) : $(options.binder);

    var path = svgView.trailPath,
      length = path.getTotalLength();

    path.style.strokeDasharray = length + ' ' + length;

    var $svg = $(svgView.svg);
    $svg.one('appear.ydui.progressbar', function () {
      _this.set(progress);
    });
    $element.append($svg);

    if (options.delay) {
      _this.checkInView($svg);

      _this.$binder.on('scroll.ydui.progressbar', function () {
        _this.checkInView($svg);
      });

      $(window).on('resize', function () {
        _this.checkInView($svg);
      });
    } else {
      $svg.trigger('appear.ydui.progressbar');
    }

    return this;
  };

  ProgressBar.prototype.checkInView = function ($svg) {

    var _this = this,
      $binder = _this.$binder,
      contentHeight = $binder.height(),
      contentTop = $binder.get(0) === window ? $(window).scrollTop() : $binder.offset().top;

    var post = $svg.offset().top - contentTop,
      posb = post + $svg.height();

    if ((post >= 0 && post < contentHeight) || (posb > 0 && posb <= contentHeight)) {
      $svg.trigger('appear.ydui.progressbar');
    }
  };

  ProgressBar.prototype.createSvgView = function () {
    var _this = this,
      options = _this.options;

    var svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    _this.initSvg(svg, options);

    var path = _this.createPath(options);
    svg.appendChild(path);

    var trailPath = null;
    if (options.trailColor || options.trailWidth) {
      trailPath = _this.createTrailPath(options);
      trailPath.style.strokeDashoffset = trailPath.getTotalLength();
      svg.appendChild(trailPath);
    }

    _this.svg = svg;
    _this.trailPath = trailPath;

    return {
      svg: svg,
      trailPath: trailPath
    }
  };

  ProgressBar.prototype.createTrailPath = function (options) {

    var _this = this;

    if (options.trailWidth == 0) {
      options.trailWidth = options.strokeWidth;
    }

    var pathString = _this.getPathString(options.trailWidth);

    return _this.createPathElement(pathString, options.trailColor, options.trailWidth);
  };

  ProgressBar.prototype.createPath = function (options) {
    var _this = this,
      width = options.strokeWidth;

    if (options.trailWidth && options.trailWidth > options.strokeWidth) {
      width = options.trailWidth;
    }

    var pathString = _this.getPathString(width);
    return _this.createPathElement(pathString, options.strokeColor, options.strokeWidth, options.fill);
  };

  ProgressBar.prototype.createPathElement = function (pathString, color, width, fill) {

    var path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathString);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', width);

    if (fill) {
      path.setAttribute('fill', fill);
    } else {
      path.setAttribute('fill-opacity', '0');
    }

    return path;
  };

  ProgressBar.prototype.render = function (template, vars) {
    var rendered = template;

    for (var key in vars) {
      if (vars.hasOwnProperty(key)) {
        var val = vars[key];
        var regExpString = '\\{' + key + '\\}';
        var regExp = new RegExp(regExpString, 'g');

        rendered = rendered.replace(regExp, val);
      }
    }

    return rendered;
  };

  function Plugin(option) {
    var args = Array.prototype.slice.call(arguments, 1);

    return this.each(function () {
      var $this = $(this),
        progressbar = $this.data('ydui.progressbar');

      if (!progressbar) {
        if (option.type == 'line') {
          $this.data('ydui.progressbar', (progressbar = new Line(this, option)));
        } else {
          $this.data('ydui.progressbar', (progressbar = new Circle(this, option)));
        }
        if (!option || typeof option == 'object') {
          progressbar.appendView();
        }
      }

      if (typeof option == 'string') {
        progressbar[option] && progressbar[option].apply(progressbar, args);
      }
    });
  }

  $('[data-ydui-progressbar]').each(function () {
    var $this = $(this);

    Plugin.call($this, util.parseOptions($this.data('ydui-progressbar')));
  });

  $.fn.progressBar = Plugin;

}(window);

/**
 * PullRefresh Plugin
 */
! function (window) {
  "use strict";

  function PullRefresh(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, PullRefresh.DEFAULTS, options || {});
    this.init();
  }

  PullRefresh.DEFAULTS = {
    loadListFn: null,
    initLoad: true,
    distance: 100
  };

  PullRefresh.prototype.init = function () {
    var _this = this,
      touches = _this.touches;

    _this.$dragTip = $('<div class="pullrefresh-dragtip"><span></span></div>');

    _this.$element.after(_this.$dragTip);

    _this.offsetTop = _this.$element.offset().top;

    _this.initTip();

    _this.bindEvent();

    if (_this.options.initLoad) {
      touches.loading = true;

      typeof _this.options.loadListFn == 'function' && _this.options.loadListFn().done(function () {
        touches.loading = false;
      });
    }
  };

  PullRefresh.prototype.bindEvent = function () {
    var _this = this;

    _this.$element.on('touchstart.ydui.pullrefresh', function (e) {
      _this.onTouchStart(e);
    }).on('touchmove.ydui.pullrefresh', function (e) {
      _this.onTouchMove(e);
    }).on('touchend.ydui.pullrefresh', function (e) {
      _this.onTouchEnd(e);
    });

    _this.stopWeixinDrag();
  };

  PullRefresh.prototype.touches = {
    loading: false,
    startClientY: 0,
    moveOffset: 0,
    isDraging: false
  };

  PullRefresh.prototype.stopWeixinDrag = function () {
    var _this = this;
    $(document.body).on('touchmove.ydui.pullrefresh', function (event) {
      _this.touches.isDraging && event.preventDefault();
    });
  };

  PullRefresh.prototype.onTouchStart = function (event) {
    var _this = this;

    if (_this.touches.loading) {
      event.preventDefault();
      return;
    }

    if (_this.$element.offset().top < _this.offsetTop) {
      return;
    }

    _this.touches.startClientY = event.originalEvent.touches[0].clientY;
  };

  PullRefresh.prototype.onTouchMove = function (event) {
    var _this = this,
      _touches = event.originalEvent.touches[0];

    if (_this.touches.loading) {
      event.preventDefault();
      return;
    }

    if (_this.touches.startClientY > _touches.clientY || _this.$element.offset().top < _this.offsetTop || _this.touches.loading) {
      return;
    }

    _this.touches.isDraging = true;

    var deltaSlide = _touches.clientY - _this.touches.startClientY;

    _this.$dragTip.find('span').css('opacity', deltaSlide / 100);

    if (deltaSlide >= _this.options.distance) {
      deltaSlide = _this.options.distance;
    }

    _this.$dragTip.find('span').css('transform', 'rotate(' + deltaSlide / 0.25 + 'deg)');

    _this.touches.moveOffset = deltaSlide;

    _this.moveDragTip(deltaSlide);
  };

  PullRefresh.prototype.onTouchEnd = function (event) {

    var _this = this,
      touches = _this.touches;

    if (touches.loading) {
      event.preventDefault();
      return;
    }

    if (_this.$element.offset().top < _this.offsetTop) {
      return;
    }

    _this.$dragTip.addClass('pullrefresh-animation-timing');

    if (touches.moveOffset >= _this.options.distance) {
      _this.moveDragTip(_this.options.distance / 1.5);
      _this.$dragTip.find('span').addClass('pullrefresh-loading');
      _this.triggerLoad();
      return;
    }

    _this.touches.isDraging = false;

    _this.resetDragTip();

    _this.resetLoading();
  };

  PullRefresh.prototype.triggerLoad = function () {
    var _this = this,
      touches = _this.touches;

    touches.loading = true;

    typeof _this.options.loadListFn == 'function' && _this.options.loadListFn().done(function () {
      setTimeout(function () {
        _this.$dragTip.css({ 'transform': 'translate3d(0px, ' + (_this.options.distance / 1.5) + 'px, 0px) scale(0)' });
        _this.resetDragTip();
      }, 200);
    });
  };

  PullRefresh.prototype.resetLoading = function () {
    var _this = this;
    _this.moveDragTip(0);

    _this.$dragTip.find('span').removeClass('pullrefresh-loading').css({ 'opacity': 0.5, 'transform': 'rotate(0deg)' });
  };

  PullRefresh.prototype.resetDragTip = function () {
    var _this = this,
      touches = _this.touches;

    setTimeout(function () {
      touches.isDraging = false;
      touches.loading = false;
      touches.moveOffset = 0;
      _this.moveDragTip(0);
      _this.resetLoading();
      _this.$dragTip.removeClass('pullrefresh-animation-timing');
    }, 150);
  };

  PullRefresh.prototype.moveDragTip = function (y) {
    this.$dragTip.css({ 'transform': 'translate3d(0,' + y + 'px,0) scale(1)' });
  };

  PullRefresh.prototype.initTip = function () {
    var _this = this,
      ls = window.localStorage;

    if (ls.getItem('LIST-PULLREFRESH-TIP') == 'YDUI') return;

    _this.$tip = $('<div class="pullrefresh-draghelp"><div><span>下拉更新</span></div></div>');

    _this.$tip.on('click.ydui.pullrefresh', function () {
      $(this).remove();
    });

    _this.$element.after(_this.$tip);
    ls.setItem('LIST-PULLREFRESH-TIP', 'YDUI');

    setTimeout(function () {
      _this.$tip.remove();
    }, 5000);
  };

  function Plugin(option) {
    return this.each(function () {
      var self = this;
      new PullRefresh(self, option);
    });
  }

  $.fn.pullRefresh = Plugin;

}(window);

/**
 * ScrollTab Plugin
 */
! function (window) {
  "use strict";

  function ScrollTab(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, ScrollTab.DEFAULTS, options || {});
    this.init();
  }

  ScrollTab.DEFAULTS = {
    navItem: '.scrolltab-item',
    content: '.scrolltab-content',
    contentItem: '.scrolltab-content-item',
    initIndex: 0
  };

  ScrollTab.prototype.init = function () {
    var _this = this,
      $element = _this.$element,
      options = _this.options;

    _this.$navItem = $element.find(options.navItem);
    _this.$content = $element.find(options.content);
    _this.$contentItem = $element.find(options.contentItem);

    _this.scrolling = false;
    _this.contentOffsetTop = _this.$content.offset().top;

    _this.bindEvent();

    _this.movePosition(_this.options.initIndex, false);
  };

  ScrollTab.prototype.bindEvent = function () {
    var _this = this;

    _this.$content.on('resize.ydui.scrolltab scroll.ydui.scrolltab', function () {
      _this.checkInView();
    });

    _this.$navItem.on('click.ydui.scrolltab', function () {
      _this.movePosition($(this).index(), true);
    });
  };

  ScrollTab.prototype.movePosition = function (index, animate) {
    var _this = this;

    if (_this.scrolling) return;
    _this.scrolling = true;

    _this.$navItem.removeClass('crt');
    _this.$navItem.eq(index).addClass('crt');

    var $item = _this.$contentItem.eq(index);
    if (!$item[0]) return;

    var offset = $item.offset().top;

    var top = offset + _this.$content.scrollTop() - _this.contentOffsetTop + 1;

    _this.$content.stop().animate({ scrollTop: top }, animate ? 200 : 0, function () {
      _this.scrolling = false;
    });
  };

  ScrollTab.prototype.checkInView = function () {
    var _this = this;

    if (_this.scrolling) return;

    if (_this.isScrollTop()) {
      _this.setClass(0);
      return;
    }

    if (_this.isScrollBottom()) {
      _this.setClass(_this.$navItem.length - 1);
      return;
    }

    _this.$contentItem.each(function () {
      var $this = $(this);

      if ($this.offset().top <= _this.contentOffsetTop) {
        _this.setClass($this.index());
      }
    });
  };

  ScrollTab.prototype.setClass = function (index) {
    this.$navItem.removeClass('crt').eq(index).addClass('crt');
  };

  ScrollTab.prototype.isScrollTop = function () {
    return this.$content.scrollTop() == 0;
  };

  ScrollTab.prototype.isScrollBottom = function () {
    var _this = this;

    return _this.$content.scrollTop() + 3 >= _this.$contentItem.height() * _this.$contentItem.length - _this.$content.height();
  };

  function Plugin(option) {
    var args = Array.prototype.slice.call(arguments, 1);

    return this.each(function () {
      var target = this,
        $this = $(target),
        scrollTab = $this.data('ydui.scrolltab');

      if (!scrollTab) {
        $this.data('ydui.scrolltab', (scrollTab = new ScrollTab(target, option)));
      }

      if (typeof option == 'string') {
        scrollTab[option] && scrollTab[option].apply(scrollTab, args);
      }
    });
  }

  $(window).on('load.ydui.scrolltab', function () {
    $('[data-ydui-scrolltab]').each(function () {
      var $this = $(this);
      $this.scrollTab(window.YDUI.util.parseOptions($this.data('ydui-scrolltab')));
    });
  });

  $.fn.scrollTab = Plugin;

}(window);

/**
 * SendCode Plugin
 */
! function () {
  "use strict";

  function SendCode(element, options) {
    this.$btn = $(element);
    this.options = $.extend({}, SendCode.DEFAULTS, options || {});
  }

  SendCode.DEFAULTS = {
    run: false, // 是否自动倒计时
    secs: 60, // 倒计时时长（秒）
    disClass: '', // 禁用按钮样式
    runStr: '{%s}秒后重新获取', // 倒计时显示文本
    resetStr: '重新获取验证码' // 倒计时结束后按钮显示文本
  };

  SendCode.timer = null;

  /**
   * 开始倒计时
   */
  SendCode.prototype.start = function () {
    var _this = this,
      options = _this.options,
      secs = options.secs;

    _this.$btn.html(_this.getStr(secs)).css('pointer-events', 'none').addClass(options.disClass);

    _this.timer = setInterval(function () {
      secs--;
      _this.$btn.html(_this.getStr(secs));
      if (secs <= 0) {
        _this.resetBtn();
        clearInterval(_this.timer);
      }
    }, 1000);
  };

  /**
   * 获取倒计时显示文本
   * @param secs
   * @returns {string}
   */
  SendCode.prototype.getStr = function (secs) {
    return this.options.runStr.replace(/\{([^{]*?)%s(.*?)\}/g, secs);
  };

  /**
   * 重置按钮
   */
  SendCode.prototype.resetBtn = function () {
    var _this = this,
      options = _this.options;

    _this.$btn.html(options.resetStr).css('pointer-events', 'auto').removeClass(options.disClass);
  };

  function Plugin(option) {
    var args = Array.prototype.slice.call(arguments, 1);

    return this.each(function () {
      var $this = $(this),
        sendcode = $this.data('ydui.sendcode');

      if (!sendcode) {
        $this.data('ydui.sendcode', (sendcode = new SendCode(this, option)));
        if (typeof option == 'object' && option.run) {
          sendcode.start();
        }
      }
      if (typeof option == 'string') {
        sendcode[option] && sendcode[option].apply(sendcode, args);
      }
    });
  }

  $.fn.sendCode = Plugin;
}();

/**
 * Slider Plugin
 */
! function (window) {
  "use strict";

  function Slider(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Slider.DEFAULTS, options || {});
    this.init();
  }

  Slider.DEFAULTS = {
    speed: 300, // 移动速度
    autoplay: 3000, // 循环时间
    lazyLoad: false, // 是否延迟加载图片 data-src=""
    pagination: '.slider-pagination',
    wrapperClass: 'slider-wrapper',
    slideClass: 'slider-item',
    bulletClass: 'slider-pagination-item',
    bulletActiveClass: 'slider-pagination-item-active'
  };

  /**
   * 初始化
   */
  Slider.prototype.init = function () {
    var _this = this,
      options = _this.options,
      $element = _this.$element;

    _this.index = 1;
    _this.autoPlayTimer = null;
    _this.$pagination = $element.find(options.pagination);
    _this.$wrapper = $element.find('.' + options.wrapperClass);
    _this.itemNums = _this.$wrapper.find('.' + options.slideClass).length;

    options.lazyLoad && _this.loadImage(0);

    _this.createBullet();

    _this.cloneItem().bindEvent();
  };

  /**
   * 绑定事件
   */
  Slider.prototype.bindEvent = function () {
    var _this = this,
      touchEvents = _this.touchEvents();

    _this.$wrapper.find('.' + _this.options.slideClass)
      .on(touchEvents.start, function (e) {
        _this.onTouchStart(e);
      }).on(touchEvents.move, function (e) {
        _this.onTouchMove(e);
      }).on(touchEvents.end, function (e) {
        _this.onTouchEnd(e);
      });

    $(window).on('resize.ydui.slider', function () {
      _this.setSlidesSize();
    });

    ~~_this.options.autoplay > 0 && _this.autoPlay();

    _this.$wrapper.on('click.ydui.slider', function (e) {
      if (!_this.touches.allowClick) {
        e.preventDefault();
      }
    });
  };

  /**
   * 复制第一个和最后一个item
   * @returns {Slider}
   */
  Slider.prototype.cloneItem = function () {
    var _this = this,
      $wrapper = _this.$wrapper,
      $sliderItem = _this.$wrapper.find('.' + _this.options.slideClass),
      $firstChild = $sliderItem.filter(':first-child').clone(),
      $lastChild = $sliderItem.filter(':last-child').clone();

    $wrapper.prepend($lastChild);
    $wrapper.append($firstChild);

    _this.setSlidesSize();

    return _this;
  };

  /**
   * 创建点点点
   */
  Slider.prototype.createBullet = function () {

    var _this = this;

    if (!_this.$pagination[0]) return;

    var initActive = '<span class="' + (_this.options.bulletClass + ' ' + _this.options.bulletActiveClass) + '"></span>';

    _this.$pagination.append(initActive + new Array(_this.itemNums).join('<span class="' + _this.options.bulletClass + '"></span>'));
  };

  /**
   * 当前页码标识加高亮
   */
  Slider.prototype.activeBullet = function () {
    var _this = this;

    if (!_this.$pagination[0]) return;

    var itemNums = _this.itemNums,
      index = _this.index % itemNums >= itemNums ? 0 : _this.index % itemNums - 1,
      bulletActiveClass = _this.options.bulletActiveClass;

    !!_this.$pagination[0] && _this.$pagination.find('.' + _this.options.bulletClass)
      .removeClass(bulletActiveClass)
      .eq(index).addClass(bulletActiveClass);
  };

  /**
   * 设置item宽度
   */
  Slider.prototype.setSlidesSize = function () {
    var _this = this,
      _width = _this.$wrapper.width();

    _this.$wrapper.css('transform', 'translate3d(-' + _width + 'px,0,0)');
    _this.$wrapper.find('.' + _this.options.slideClass).css({ width: _width });
  };

  /**
   * 自动播放
   */
  Slider.prototype.autoPlay = function () {
    var _this = this;

    _this.autoPlayTimer = setInterval(function () {

      if (_this.index > _this.itemNums) {
        _this.index = 1;
        _this.setTranslate(0, -_this.$wrapper.width());
      }

      _this.setTranslate(_this.options.speed, -(++_this.index * _this.$wrapper.width()));

    }, _this.options.autoplay);
  };

  /**
   * 停止播放
   * @returns {Slider}
   */
  Slider.prototype.stopAutoplay = function () {
    var _this = this;
    clearInterval(_this.autoPlayTimer);
    return _this;
  };

  /**
   * 延迟加载图片
   * @param index 索引
   */
  Slider.prototype.loadImage = function (index) {
    var _this = this,
      $img = _this.$wrapper.find('.' + _this.options.slideClass).eq(index).find('img'),
      imgsrc = $img.data('src');

    $img.data('load') != 1 && !!imgsrc && $img.attr('src', imgsrc).data('load', 1);
  };

  /**
   * 左右滑动Slider
   * @param speed 移动速度 0：当前是偷偷摸摸的移动啦，生怕给你看见
   * @param x 横向移动宽度
   */
  Slider.prototype.setTranslate = function (speed, x) {
    var _this = this;

    _this.options.lazyLoad && _this.loadImage(_this.index);

    _this.activeBullet();

    _this.$wrapper.css({
      'transitionDuration': speed + 'ms',
      'transform': 'translate3d(' + x + 'px,0,0)'
    });
  };

  /**
   * 处理滑动一些标识
   */
  Slider.prototype.touches = {
    moveTag: 0, // 移动状态(start,move,end)标记
    startClientX: 0, // 起始拖动坐标
    moveOffset: 0, // 移动偏移量（左右拖动宽度）
    touchStartTime: 0, // 开始触摸的时间点
    isTouchEvent: false, // 是否触摸事件
    allowClick: false // 用于判断事件为点击还是拖动
  };

  /**
   * 开始滑动
   * @param event
   */
  Slider.prototype.onTouchStart = function (event) {
    if (event.originalEvent.touches)
      event = event.originalEvent.touches[0];

    var _this = this,
      touches = _this.touches;

    touches.allowClick = true;

    touches.isTouchEvent = event.type === 'touchstart';

    // 鼠标右键
    if (!touches.isTouchEvent && 'which' in event && event.which === 3) return;

    if (touches.moveTag == 0) {
      touches.moveTag = 1;

      // 记录鼠标起始拖动位置
      touches.startClientX = event.clientX;
      // 记录开始触摸时间
      touches.touchStartTime = Date.now();

      var itemNums = _this.itemNums;

      if (_this.index == 0) {
        _this.index = itemNums;
        _this.setTranslate(0, -itemNums * _this.$wrapper.width());
        return;
      }

      if (_this.index > itemNums) {
        _this.index = 1;
        _this.setTranslate(0, -_this.$wrapper.width());
      }
    }
  };

  /**
   * 滑动中
   * @param event
   */
  Slider.prototype.onTouchMove = function (event) {
    event.preventDefault();

    if (event.originalEvent.touches)
      event = event.originalEvent.touches[0];

    var _this = this,
      touches = _this.touches;

    touches.allowClick = false;

    if (touches.isTouchEvent && event.type === 'mousemove') return;

    // 拖动偏移量
    var deltaSlide = touches.moveOffset = event.clientX - touches.startClientX;

    if (deltaSlide != 0 && touches.moveTag != 0) {

      if (touches.moveTag == 1) {
        _this.stopAutoplay();
        touches.moveTag = 2;
      }
      if (touches.moveTag == 2) {
        _this.setTranslate(0, -_this.index * _this.$wrapper.width() + deltaSlide);
      }
    }
  };

  /**
   * 滑动后
   */
  Slider.prototype.onTouchEnd = function () {
    var _this = this,
      speed = _this.options.speed,
      _width = _this.$wrapper.width(),
      touches = _this.touches,
      moveOffset = touches.moveOffset;

    // 释放a链接点击跳转
    setTimeout(function () {
      touches.allowClick = true;
    }, 0);

    // 短暂点击并未拖动
    if (touches.moveTag == 1) {
      touches.moveTag = 0;
    }

    if (touches.moveTag == 2) {
      touches.moveTag = 0;

      // 计算开始触摸到结束触摸时间，用以计算是否需要滑至下一页
      var timeDiff = Date.now() - touches.touchStartTime;

      // 拖动时间超过300毫秒或者未拖动超过内容一半
      if (timeDiff > 300 && Math.abs(moveOffset) <= _this.$wrapper.width() * .5) {
        // 弹回去
        _this.setTranslate(speed, -_this.index * _this.$wrapper.width());
      } else {
        // --为左移，++为右移
        _this.setTranslate(speed, -((moveOffset > 0 ? --_this.index : ++_this.index) * _width));
      }
      _this.autoPlay();
    }
  };

  /**
   * 当前设备支持的事件
   * @type {{start, move, end}}
   */
  Slider.prototype.touchEvents = function () {
    var supportTouch = (window.Modernizr && !!window.Modernizr.touch) || (function () {
      return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
    })();

    return {
      start: supportTouch ? 'touchstart.ydui.slider' : 'mousedown.ydui.slider',
      move: supportTouch ? 'touchmove.ydui.slider' : 'mousemove.ydui.slider',
      end: supportTouch ? 'touchend.ydui.slider' : 'mouseup.ydui.slider'
    };
  };

  function Plugin(option) {
    return this.each(function () {

      var $this = $(this),
        slider = $this.data('ydui.slider');

      if (!slider) {
        $this.data('ydui.slider', new Slider(this, option));
      }
    });
  }

  $(window).on('load.ydui.slider', function () {
    $('[data-ydui-slider]').each(function () {
      var $this = $(this);
      $this.slider(window.YDUI.util.parseOptions($this.data('ydui-slider')));
    });
  });

  $.fn.slider = Plugin;

}(window);

/**
 * Spinner Plugin
 */
! function (window) {
  "use strict";

  function Spinner(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Spinner.DEFAULTS, options || {});
    this.init();
  }

  Spinner.DEFAULTS = {
    input: '.J_Input',
    add: '.J_Add',
    minus: '.J_Del',
    unit: 1,
    max: 0,
    min: -1,
    longpress: true,
    callback: null
  };

  Spinner.prototype.init = function () {
    var _this = this,
      options = _this.options;

    _this.$input = $(options.input, _this.$element);
    _this.$add = $(options.add, _this.$element);
    _this.$minus = $(options.minus, _this.$element);

    _this.changeParameters();

    _this.checkParameters();

    _this.bindEvent();
  };

  Spinner.prototype.tapParams = {};

  Spinner.prototype.isNumber = function (val) {
    //return /^([0]|[1-9]\d*)(\.\d{1,2})?$/.test(val);
    return /^\d*$/.test(val);
  };

  Spinner.prototype.FixNumber = function (val) {
    //return parseFloat(val);
    return parseInt(val);
  };

  Spinner.prototype.changeParameters = function () {

    var _this = this,
      options = _this.options;

    var params = [
      { param: 'unit', default: 1 },
      { param: 'max', default: 0 }
    ];

    $.each(params, function (k, v) {
      var _val = options[v.param],
        _dataVal = _this.$input.data(v.param);

      if (!!_dataVal) {
        _val = _dataVal;
        if (!_this.isNumber(_dataVal)) {
          _val = options[v.param];
          if (typeof _val == 'function') {
            _val = _val();
          }
        }
      } else {
        if (typeof options[v.param] == 'function') {
          var _fnVal = options[v.param]();

          _val = _fnVal;
          if (!_this.isNumber(_fnVal)) {
            _val = options[v.param];
          }
        }
      }

      if (!_this.isNumber(_val)) {
        _val = v.default;
      }

      options[v.param] = _this.FixNumber(_val);
    });
  };

  Spinner.prototype.checkParameters = function () {
    var _this = this,
      options = _this.options,
      value = _this.$input.val();

    if (value) {
      _this.setValue(value);
    } else {
      if (options.max < options.min && options.max != 0) {
        options.max = options.min;
      }

      if (options.min < options.unit && options.min > 0) {
        options.min = options.unit;
      }
      if (options.min % options.unit != 0 && options.min > 0) {
        options.min = options.min - options.min % options.unit;
      }

      if (options.max < options.unit && options.max != 0) {
        options.max = options.unit;
      }
      if (options.max % options.unit != 0) {
        options.max = options.max - options.max % options.unit;
      }
      if (options.min < 0) {
        options.min = options.unit;
      }
      _this.setValue(options.min);
    }
  };

  Spinner.prototype.calculation = function (type) {
    var _this = this,
      options = _this.options,
      max = options.max,
      unit = options.unit,
      min = options.min,
      $input = _this.$input,
      val = _this.FixNumber($input.val());

    if (!!$input.attr('readonly') || !!$input.attr('disabled')) return;

    var newval;
    if (type == 'add') {
      newval = val + unit;
      if (max != 0 && newval > max) return;
    } else {
      newval = val - unit;
      if (newval < min) return;
    }

    _this.setValue(newval);

    options.longpress && _this.longpressHandler(type);
  };

  Spinner.prototype.longpressHandler = function (type) {
    var _this = this;

    var currentDate = new Date().getTime() / 1000,
      intervalTime = currentDate - _this.tapStartTime;

    if (intervalTime < 1) intervalTime = 0.5;

    var secondCount = intervalTime * 10;
    if (intervalTime == 30) secondCount = 50;
    if (intervalTime >= 40) secondCount = 100;

    _this.tapParams.timer = setTimeout(function () {
      _this.calculation(type);
    }, 1000 / secondCount);
  };

  Spinner.prototype.setValue = function (val) {
    var _this = this,
      options = _this.options,
      max = options.max,
      unit = options.unit,
      min = options.min < 0 ? unit : options.min;

    if (!/^(([1-9]\d*)|0)$/.test(val)) val = max;

    if (val > max && max != 0) val = max;

    if (val % unit > 0) {
      val = val - val % unit + unit;
      if (val > max && max != 0) val -= unit;
    }

    if (val < min) val = min - min % unit;

    _this.$input.val(val);

    typeof options.callback == 'function' && options.callback(val, _this.$input);
  };

  Spinner.prototype.bindEvent = function () {
    var _this = this,
      options = _this.options,
      isMobile = YDUI.device.isMobile,
      mousedownEvent = 'mousedown.ydui.spinner',
      mouseupEvent = 'mouseup.ydui.spinner';

    if (isMobile) {
      mousedownEvent = 'touchstart.ydui.spinner';
      mouseupEvent = 'touchend.ydui.spinner';
    }

    _this.$add.on(mousedownEvent, function (e) {
      if (options.longpress) {
        e.preventDefault();
        e.stopPropagation();
        _this.tapStartTime = new Date().getTime() / 1000;

        _this.$add.on(mouseupEvent, function () {
          _this.clearTapTimer();
        });
      }

      _this.calculation('add');
    });

    _this.$minus.on(mousedownEvent, function (e) {
      if (options.longpress) {
        e.preventDefault();
        e.stopPropagation();

        _this.tapStartTime = new Date().getTime() / 1000;

        _this.$minus.on(mouseupEvent, function () {
          _this.clearTapTimer();
        });
      }

      _this.calculation('minus');
    });

    _this.$input.on('change.ydui.spinner', function () {
      _this.setValue($(this).val());
    }).on('keydown', function (event) {
      if (event.keyCode == 13) {
        _this.setValue($(this).val());
        return false;
      }
    });
  };

  Spinner.prototype.clearTapTimer = function () {
    var _this = this;
    clearTimeout(_this.tapParams.timer);
  };

  function Plugin(option) {
    var args = Array.prototype.slice.call(arguments, 1);

    return this.each(function () {
      var $this = $(this),
        spinner = $this.data('ydui.spinner');

      if (!spinner) {
        $this.data('ydui.spinner', (spinner = new Spinner(this, option)));
      }

      if (typeof option == 'string') {
        spinner[option] && spinner[option].apply(spinner, args);
      }
    });
  }

  $(window).on('load.ydui.spinner', function () {
    $('[data-ydui-spinner]').each(function () {
      var $this = $(this);
      $this.spinner(window.YDUI.util.parseOptions($this.data('ydui-spinner')));
    });
  });

  $.fn.spinner = Plugin;
}(window);

/**
 * Tab Plugin
 */
! function (window) {
  "use strict";

  function Tab(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Tab.DEFAULTS, options || {});
    this.init();
    this.bindEvent();
    this.transitioning = false;
  }

  // 150ms 为切换动画执行时间
  Tab.TRANSITION_DURATION = 150;

  Tab.DEFAULTS = {
    nav: '.tab-nav-item',
    panel: '.tab-panel-item',
    activeClass: 'tab-active'
  };

  Tab.prototype.init = function () {
    var _this = this,
      $element = _this.$element;

    _this.$nav = $element.find(_this.options.nav);
    _this.$panel = $element.find(_this.options.panel);
  };

  /**
   * 給选项卡导航绑定点击事件
   */
  Tab.prototype.bindEvent = function () {
    var _this = this;
    _this.$nav.each(function (e) {
      $(this).on('click.ydui.tab', function () {
        _this.open(e);
      });
    });
  };

  /**
   * 打开选项卡
   * @param index 当前导航索引
   */
  Tab.prototype.open = function (index) {
    var _this = this;

    index = typeof index == 'number' ? index : _this.$nav.filter(index).index();

    var $curNav = _this.$nav.eq(index);

    // 如果切换动画进行时或者当前二次点击 禁止重复操作
    if (_this.transitioning || $curNav.hasClass(_this.options.activeClass)) return;

    _this.transitioning = true;

    // 打开选项卡时绑定自定义事件
    $curNav.trigger($.Event('open.ydui.tab', {
      index: index
    }));

    // 给tab导航添加选中样式
    _this.active($curNav, _this.$nav);

    // 给tab内容添加选中样式
    _this.active(_this.$panel.eq(index), _this.$panel, function () {
      // 打开选项卡后绑定自定义事件
      $curNav.trigger({
        type: 'opened.ydui.tab',
        index: index
      });
      _this.transitioning = false;
    });
  };

  /**
   * 添加选中样式
   * @param $element 当前需要添加选中样式的对象
   * @param $container 当前对象的同级所有对象
   * @param callback 回调
   */
  Tab.prototype.active = function ($element, $container, callback) {
    var _this = this,
      activeClass = _this.options.activeClass;

    var $avtive = $container.filter('.' + activeClass);

    function next() {
      typeof callback == 'function' && callback();
    }

    // 动画执行完毕后回调
    $element.one('webkitTransitionEnd', next).emulateTransitionEnd(Tab.TRANSITION_DURATION);

    $avtive.removeClass(activeClass);
    $element.addClass(activeClass);
  };

  function Plugin(option) {
    var args = Array.prototype.slice.call(arguments, 1);

    return this.each(function () {
      var target = this,
        $this = $(target),
        tab = $this.data('ydui.tab');

      if (!tab) {
        $this.data('ydui.tab', (tab = new Tab(target, option)));
      }

      if (typeof option == 'string') {
        tab[option] && tab[option].apply(tab, args);
      }
    });
  }

  $(window).on('load.ydui.tab', function () {
    $('[data-ydui-tab]').each(function () {
      var $this = $(this);
      $this.tab(window.YDUI.util.parseOptions($this.data('ydui-tab')));
    });
  });

  $.fn.tab = Plugin;

}(window);
