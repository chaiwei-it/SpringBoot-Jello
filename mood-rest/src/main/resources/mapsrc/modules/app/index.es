/**
 *  首页
 *  2017年08月16日13:47:32
 *  ZhangWuQiang
 */

import { openUrl } from 'js/app';
import Swiper from 'swiper';
/**
 *  首页轮播图
 */
! function () {
  var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    parallax: true,
    speed: 666,
    loop: true
  });
}()
/**
 *  页面跳转
 */
! function () {
  $("#target").on("click", function () {
    openUrl("wap.html", "_self")
  })
  $("#map").on("click", function () {
    openUrl("map.html", "_self")
  })
}();

/**
 *  首页滚动头部效果事件
 */
! function () {
  $("#Js_scroll").on("scroll", function () {
    mts.changeColor($(this).scrollTop())
  })
}();

/**
 *  方法区
 */
var mts = {
  changeColor: function (scroll) {
    var last = 0.85
    var val = (scroll / 2) / 100;
    val = val >= last ? last : val
    this.headToogelClass(scroll, val)
  },
  headToogelClass(value, val) {
    $("#Js_change").css("opacity", val)
    var $header = $("#header")
    if ((value / 2) < 50) {
      $header.addClass("index_hover")
    } else {
      $header.removeClass("index_hover")
    }
  }
}
