var app = require("app");
var api = require('app/api');

// 表单验证

$(function() {
  $('#doc-vld-msg').validator({
    onValid: function(validity) {
      $(validity.field).closest('.am-form-group').find('.am-alert').hide();
    },

    onInValid: function(validity) {
      var $field = $(validity.field);
      var $group = $field.closest('.am-form-group');
      var $alert = $group.find('.am-alert');
      // 使用自定义的提示信息 或 插件内置的提示信息
      var msg = $field.data('validationMessage') || this.getValidationMessage(validity);

     
      if (!$alert.length) {
        $alert = $('<div class="am-alert am-alert-danger"></div>').hide().
          appendTo($group); 
      }

      $alert.html(msg).show();
    }
  });
  
});



$("#login").click(function(){
	
   /**
   *  登录
   *  @param Function
   */
   $("#login").attr('disabled',"true");
   $("#login").val('登录中...');


   var url = api.login;
   var param = {
   	username: $("#username").val(),
   	password: $("#password").val(),
   	grant_type: 'password'
   }

   var callback = function(result){
     	$("#login").removeAttr("disabled");
      $("#login").val('登录');

     	if (result.code == 200) {
        // 存储用户信息
        app.sets('user', result.data[0])
        app.message('登录成功', 'success')
         // 刷新
        setTimeout(function() {
          history.back()
        }, 1300)
      } else if(result.code == 20003){
        app.message(result.message, 'error')
      }else {
        app.message(result.message, 'error')
        return false
      }
   }
   app.ajax(url, 'post', param, callback)
})

