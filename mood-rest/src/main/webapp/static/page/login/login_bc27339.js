define("page/login/login",["require","exports","module","components/app/app","components/app/api"],function(e){var a=e("components/app/app"),o=e("components/app/api");$(function(){$("#doc-vld-msg").validator({onValid:function(e){$(e.field).closest(".am-form-group").find(".am-alert").hide()},onInValid:function(e){var a=$(e.field),o=a.closest(".am-form-group"),s=o.find(".am-alert"),n=a.data("validationMessage")||this.getValidationMessage(e);s.length||(s=$('<div class="am-alert am-alert-danger"></div>').hide().appendTo(o)),s.html(n).show()}})}),$("#login").click(function(){$("#login").attr("disabled","true"),$("#login").val("登录中...");var e=o.login,s={username:$("#username").val(),password:$("#password").val(),grant_type:"password"},n=function(e){if($("#login").removeAttr("disabled"),$("#login").val("登录"),200==e.code)a.sets("user",e.data[0]),a.message("登录成功","success"),setTimeout(function(){history.back()},1300);else{if(20003!=e.code)return a.message(e.message,"error"),!1;a.message(e.message,"error")}};a.ajax(e,"post",s,n)})});