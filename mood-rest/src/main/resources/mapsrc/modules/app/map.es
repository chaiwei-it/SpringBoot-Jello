/**
 *  地图
 *  2017年08月14日16:32:44
 *  ZhangWuQiang
 */
import { ui, api, ajax, loadHtml } from 'js/app'
const dialog = ui.dialog;
var city = {};
var cityselect = {}
/**
 * 百度地图
 */
var map = new BMap.Map("allmap");
var point = new BMap.Point(116.331398, 39.897445);
var resetCenterAndZoom = (provance) => {
  console.log("resetCenterAndZoom", provance)
  map.centerAndZoom(provance, 11);
}
var gc = new BMap.Geocoder(); //地址解析类
// 先要默认重置一次
// resetCenterAndZoom("北京")

map.enableScrollWheelZoom(true);

// 自定义坐标图标
var iconSrc = $("#mapIcon").attr("src");
var icon = new BMap.Icon(iconSrc, new BMap.Size(36, 36), {
  anchor: new BMap.Size(10, 9)
});

// 创建坐标点
function addMarker(point, data) {
  var marker = new BMap.Marker(point, {
    icon: icon,
    raiseOnDrag: true
  });
  map.addOverlay(marker);
  // 点击坐标点
  marker.addEventListener("click", function (e) {
    // 通过坐标点获取街道地址
    gc.getLocation(point, function (rs) {
      var addComp = rs.addressComponents;
      var addr = addComp.province + addComp.district + addComp.street + addComp.streetNumber
      var curData = _.filter(data, { mapjson: JSON.stringify(point) });
      if (_.isArray(curData)) {
        var mapData = curData[0]
        mapData['addr'] = addr
        apps.showDialog(mapData)
      }
    });
  });
}

// 拖动地图
map.addEventListener("dragend", function () {
  var center = map.getCenter();
  var curCity = map.getCurrentCity()
  console.log("地图中心点变更为：" + center.lng + ", " + center.lat);
  console.log("地图当前显示城市为：" + curCity.name);
  curCity = curCity.name.replace('北京市', '北京')
  apps.callQuery({
    provance: curCity == '北京' ? curCity : '',
    city: curCity != '北京' ? curCity : ''
  }, center)
});
// 点击地图
map.addEventListener("click", function (e) {
  // apps.toggleDialog("hide")
});

// 地图加载完毕
map.addEventListener("tilesloaded", () => {
  console.log('地图载入完毕..')
});

// 关闭详情
$("a#close").on("click", function () {
  apps.toggleDialog("hide")
})

// 方法区
var apps = {
  callQuery: function (opt, taps) {
    console.log(taps)
    if (_.isUndefined(taps)) {
      // 重置地区
      var zoom = opt ? opt.provance + opt.city : "北京"
      resetCenterAndZoom(zoom)
    } else {
      resetCenterAndZoom(taps)
    }
    // 参数
    var provinceId = opt ? opt.provance : '';
    var cityId = opt ? opt.city : '';
    var type = this.getInputVal('radio')
    var param = { provinceId, cityId, type }
    console.log(param)
    city = param
    // 返回
    var callback = (data) => {
      map.clearOverlays()
      if (data.code == 200) {
        this.callMapData(data.data)
      }
    }
    // 请求
    ajax(api.list, "post", param, callback)
  },
  callMapData: function (data) {
    // 坐标结果
    for (let item of data) {
      var obj = JSON.parse(item.mapjson)
      if (!_.isNull(obj)) {
        var point = new BMap.Point(obj.lng, obj.lat);
        addMarker(point, data)
      }
    }
  },
  showDialog: function (obj) {
    // 详情模板
    var tpl = [
      '<h3 class="city"><%- obj.addr %></h3>',
      '<p class="type"><% var type = obj.type == 1 ? "运营商" : "供应商" %><%- type %></p>',
      '<p class="companyName"><%- obj.companyName %></p>',
      '<p class="companyPhone"><%- obj.companyPhone %></p>',
    ];
    var template = loadHtml(tpl);
    $("#tpl").html(template(obj))
    this.toggleDialog("show")
  },
  getInputVal: function (name) {
    return $(`input[name=${name}]:checked`).val()
  },
  toggleDialog: function (type) {
    // 详情dialog
    var $mapOut = $("#mapOut")
    if (type == "show") {
      $mapOut.addClass("open")
    } else {
      $mapOut.removeClass("open")
    }
  }
};

apps.callQuery(undefined, "北京");

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
    city = { provance: ret.provance, city: ret.city }
    apps.callQuery(city)
    $(this).val(ret.provance + ' ' + ret.city + ' ');
  });
}()


/**
 * 运营商、供应商选择
 */
! function () {
  var $ActionSheet = $('#J_ActionSheet');

  $('#J_ShowActionSheet').on('click', function () {
    $ActionSheet.actionSheet('open');
  });

  $('.J_Cancel').on('click', function () {
    $ActionSheet.actionSheet('close');
  });

  // 自定义事件
  $ActionSheet.on('open.ydui.actionsheet', function () {
    console.log('打开了');
  })

  $ActionSheet.on('close.ydui.actionsheet', function () {
    var value = apps.getInputVal('radio')
    var inputVal = value == "1" ? "运营商" : value == "2" ? "供应商" : "全部"
    if (!_.isUndefined(value)) {
      $("#J_ShowActionSheet").val(inputVal)
      // var isNullObj = JSON.stringify(city) == "{}" ? undefined : city
      var obj = {
        provance: city.provinceId,
        city: city.cityId
      }
      console.log(obj)
      apps.callQuery(obj, map.getCenter())
      apps.toggleDialog("hide")
    }
  });
}();
