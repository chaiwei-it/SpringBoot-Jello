/**
 *  入驻运行商、供应商
 *  2017年08月15日22:17:28
 *  ZhangWuQiang
 */

import { ui, api, ajax, openUrl, loadBaiduMap } from 'js/app'
const dialog = ui.dialog
var city = {}
/**
 * 获取dom
 */
var dom = {
  getInputVal: function (name) {
    var value
    if (name === 'radio') {
      value = $(`input[name=${name}]:checked`).val()
    } else {
      value = $(`input[name=${name}]`).val()
    }
    return value
  },
  getInputElement: function (name) {
    return $(`input[name=${name}]`)
  }
};

/**
 * 所在地区
 */
! function () {
  var $target = $('#J_Address');

  $target.citySelect();

  $target.on('click', function (event) {
    event.stopPropagation();
    $target.citySelect('open');
  });

  $target.on('done.ydui.cityselect', function (ret) {
    city['provance'] = ret.provance;
    city['city'] = ret.city;
    console.log(city)
    $(this).find('input').val(ret.provance + ' ' + ret.city);
    resetCenterAndZoom(ret.provance + ret.city)
    toggleModal()
  });
}()

/**
 * 表单提交
 */

var mapObj = {};
! function () {
  var $target = $("#J_post")
  $target.on("click", function () {
    // 参数
    var param = {
      companyName: dom.getInputVal('companyName'),
      companyPhone: dom.getInputVal('companyPhone'),
      name: dom.getInputVal('name'),
      mobile: dom.getInputVal('mobile'),
      type: dom.getInputVal('radio'),
      provinceId: city.provance,
      cityId: city.city,
      mapjson: JSON.stringify(mapObj)
    }
    // 结果
    var callback = (data) => {
      if (data.code == 200) {
        dialog.alert('恭喜您，提交成功！我们会在12小时内与您电话联系！', function () {
          openUrl("map.html", "_self")
        })
      }
    }
    // 验证表单是否有空?
    if (validator(param) && telValidate(param.companyPhone) && phoneValdate(param.mobile)) {
      ajax(api.add, "post", param, callback)
    }
  })
}()


/**
 * focus or blur
 */

! function () {
  $(document).on("focus", "input", function () {
    $(this).parent().removeClass('error')
  })

  $(document).on("blur", "input", function () {
    if (!$(this).val()) {
      $(this).parent().addClass('error')
    }
  })
}()

/**
 * 表单验证
 */
function validator(obj) {
  var o = true
  for (let item in obj) {
    if (!obj[item]) {
      console.log(item)
      var element = dom.getInputElement(item)
      element.parent().addClass('error')
      o = false
    }
  }
  return o
}

function telValidate(value) {
  var o = true
  var regTel1 = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(value); //带区号的固定电话
  var regTel2 = /^(\d{7,8})(-(\d{3,}))?$/.test(value); //不带区号的固定电话
  if (!regTel1 && !regTel2) {
    dialog.toast("请输入正确的公司电话", "none", 2000)
    dom.getInputElement("companyPhone").parent().addClass("error")
    o = false
  }
  return o
}

function phoneValdate(value) {
  var o = false
  if (value.length == 11 && (/^1[34578]\d{9}$/.test(value))) {
    var o = true
  } else {
    dialog.toast("请输入正确的联系电话", "none", 2000)
    dom.getInputElement("mobile").parent().addClass("error")
  }
  return o
}
/**
 *  显示地图模态框
 */
function toggleModal() {
  $("#modalMap").toggleClass("open")
  setTimeout(function () {
    $("#selectd").hide()
  }, 500)
}

/**
 *  创建百度地图
 */
var map = new BMap.Map("allmap");
var point = new BMap.Point(116.331398, 39.897445);
map.enableScrollWheelZoom(true);
var resetCenterAndZoom = (provance) => {
  console.log("resetCenterAndZoom", provance)
  map.centerAndZoom(provance, 11);
}
// 先要默认重置一次
resetCenterAndZoom(point)
var iconSrc = $("#mapIcon").attr("src");
// 创建坐标点
var icon = new BMap.Icon(iconSrc, new BMap.Size(36, 36), {
  anchor: new BMap.Size(10, 9)
});

function addMarker(point) {
  var marker = new BMap.Marker(point, {
    icon: icon,
    raiseOnDrag: true
  });
  map.addOverlay(marker);
};
// 点选地图获取坐标
map.addEventListener("click", function (e) {
  map.clearOverlays()
  var point = new BMap.Point(e.point.lng, e.point.lat);
  mapObj['lng'] = e.point.lng;
  mapObj['lat'] = e.point.lat;
  addMarker(point)
  $("#selectd").show()
});

// 关闭模态框
$("#close").on("click", function () {
  toggleModal()
})

$("#selectd").on("click", function () {
  toggleModal()
})
