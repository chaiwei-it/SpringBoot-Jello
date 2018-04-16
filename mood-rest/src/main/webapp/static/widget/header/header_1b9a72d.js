define('widget/header/header', ['require', 'exports', 'module', "components/app/app", "components/app/api"], function(require, exports, module) {

  var app = require("components/app/app");
  var api = require("components/app/api");
  var easemobim = window.easemobim
  $(function(){
  	//nav Highlight
    // var curpage = window.location.pathname;
    // var isHome = true
    // $('.am-nav').find('li').each(function() {
    //   var name = $(this).attr('name');
    //   if (curpage.indexOf(name) !== -1) {
    //     isHome = false
    //     $(this).addClass('on').siblings().removeClass('on');
    //   }
    //   if (isHome) {
    //     $('.am-nav').find('li[name="index"]').addClass('on');
    //   }
    // });
  
    // $('.am-dropdown-content').find('li').each(function() {
    //   var href = $(this).find('a').prop('href');
    //   if (curpage === '/partner/designer.html') {
    //     curpage = $('.am-dropdown-content li[name=partner] a').prop('href');
    //   }
    //   if (href && href.indexOf(curpage) !== -1) {
    //     $(this).addClass('am-active').siblings().removeClass('am-active');
    //   }
    // })
  
    // 用户信息
    // app.sets('username', 'test')
    var user = app.gets('user');
    if (user) {
      $('.unlogin').hide()
      $('.user-info').show();
      // 头像展示
      if (user.image.indexOf('http://') !== -1) {
        $('.user_avatar').prop('src', user.image)
      } else {
        // $('.user_avatar').prop('src', api.IMAGE_DOMAIN + user.avatar)
      }
      // console.log(user.username)
      $('.user_name').text(user.username)
    }
  
    /**
    *  退出登录
    *  @param String 退出提示语
    */
    $("#quit").click(function(){
      var confirmCallback = function(result){
        var callback = function(result){
          if (result.code !== 200) {
            vm.message(result.message, 'warning')
            return false
          }
          // 删除用户信息
          app.remove('user')
  
          // 提示消息
          vm.message('退出登录', 'success', function() {
            // 刷新
            setTimeout(function() {
              window.location.reload()
            }, 1300)
          })
        }
        app.ajax(api.logout, 'post', {}, callback)
      }
      app.confirm({title:'退出登录',message:'您确定要退出登录吗？',confirmCallback})
  
  
      // var vm = this
      // this.$confirm('您确定要退出登录吗？', {
      //   type: 'warning'
      // }).then(function() {
      // // vm.$message('即将退出登录')
      //   var callback = function(result){
      //     if (result.code !== 200) {
      //       vm.message(result.message, 'warning')
      //       return false
      //     }
      //     // 删除用户信息
      //     app.remove('user')
  
      //     // 提示消息
      //     vm.message('退出登录', 'success', function() {
      //       // 刷新
      //       setTimeout(function() {
      //         window.location.reload()
      //       }, 1300)
      //     })
      //   }
      //   app.ajax(api.loginout, 'post', {}, callback)
      // })
    })
  })
  
  
  

});