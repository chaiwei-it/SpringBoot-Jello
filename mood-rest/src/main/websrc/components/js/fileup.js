/**
 *  图片上传
 *  2017年08月29日13:47:32
 *  Totoo
 */
var app = require('app');
var api = require('app/api');

var imgUpInit = function ($ele, MAXNUM) {

  var URL = api.filesUpload;
  // 图片展示
  var convertImgToBase64 = function (file, $img) {
    var reader = new FileReader();
    reader.onload = function() {
      var base64 = reader.result.split(',')[1];
      var dataUrl = 'data:image/png;base64,' + base64;
      $img.attr('src', dataUrl);
      $img.show();
      $img.prev('.al-showX').show();
      $img.parents('.al-img').removeClass('al-new');
      var leng = $ele.find('.al-new').length;
      if (!leng)
        addImgBox();
    }
    reader.readAsDataURL(file);
  }
  // 事件绑定
  var bindEvent = function () {
    // 图上传
    $ele.find('input').unbind('change');
    $ele.find('input').on('change', function () {
      var file = $(this)[0].files[0];
      var $parent = $(this).parents('.al-img');
      var $img = $parent.find('.al-showImg');
      convertImgToBase64(file, $img);
      var callback = function (result) {
        $parent.attr('data-src', result);
      }
      var error = function (xhr) {
        app.message('网络状态差， 请稍后重试。', 'danger');
      }
      app.uploadImg(URL, file, callback, error);
    });
    // 图删除
    $ele.find('.al-showX').unbind('click');
    $ele.find('.al-showX').on('click', function (event) {
      $(this).parents('.al-img').remove();
      var length = $ele.find('.al-img').length;
      if (!length) addImgBox();
      event.preventDefault();
    });
  }
  // 添加模板
  var addImgBox = function () {
    var num = $ele.find('.al-img').length;
    if (num < MAXNUM) {
      var tpl = app.loadHtml(__inline('widget/tpl/imgUp.tpl'));
      $ele.append(tpl());
    }
    bindEvent();
  }
  addImgBox();
}
module.exports = imgUpInit;
