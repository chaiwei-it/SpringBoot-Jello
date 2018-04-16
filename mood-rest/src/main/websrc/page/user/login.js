function login(){

}

var app = require("app");
var api = require('app/api');
// function(rule,value,callback)
var vm = new Vue({
  el: '#Login',
  data:function() {
    var vm = this
    var validateMobile = function(rule,value,callback) {
      var checkVal = value.trim()
      if (!(/^1[34578]\d{9}$/.test(checkVal))) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    var validatePasswordNext = function(rule,value,callback) {
      var curVal
      if (vm.register) {
        curVal = vm.registerRuleForm.password
      } else if (vm.forget) {
        curVal = vm.forgetRuleForm.password
      }
      var checkVal = value.trim()
      console.log(checkVal, curVal)
      if (checkVal !== curVal) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      login: true,
      forget: false,
      register: false,
      dialogLogin: false,
      loginRuleForm: {
        // 登录
        username: '',
        pwd: ''
      },
      forgetRuleForm: {
        // 忘记密码
        mobile: '',
        code: '',
        password: '',
        passwordNext: ''
      },
      registerRuleForm: {
        // 注册
        mobile: '',
        code: '',
        password: '',
        passwordNext: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        pwd: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 6,
          message: '密码不能小于6位',
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          validator: validateMobile,
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 6,
          message: '密码不能小于6位',
          trigger: 'blur'
        }],
        passwordNext: [{
          required: true,
          message: '请再次输入密码',
          trigger: 'blur'
        }, {
          validator: validatePasswordNext,
          trigger: 'blur'
        }]
      },
      submit: {
        formTitle: '登录',
        loading: false,
        loginText: '登录',
        forgetText: '提交',
        registerText: '注册',
        getCode: '获取验证码'
      }
    }
  },
  mounted:function () {
    var vm = this
    // 显示登录
    $('#goLogin').click(function(){
      vm.dialogLogin = true
    })
    // 登出
    $("#quit").click(function(){
      vm.quit()
    })
  },
  methods: {
    dialogLoginClose:function () {
      this.dialogLogin = false
      if (this.login) {
        this.resetForm('loginRuleForm');
      } else if (this.forget) {
        this.resetForm('forgetRuleForm');
      } else if (this.register) {
        this.resetForm('registerRuleForm');
      }
    },
    quit:function (){
      /**
       *  退出登录
       *  @param String 退出提示语
       */
      var vm = this
      this.$confirm('您确定要退出登录吗？', {
        type: 'warning'
      }).then(function() {
        // vm.$message('即将退出登录')
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
        app.ajax(api.loginout, 'post', {}, callback)
      })
    },
    submitForm:function (formName, module) {
      /**
       *  提交
       *  @param Function
       */
      console.log(formName)
      var _this = this;
      this.$refs[formName].validate(function(valid) {
        if (valid) {
          if (module === 'login') {
            _this.login_do_submit()
          } else if (module === 'forget') {
            _this.forget_do_submit()
          } else if (module === 'register') {
            _this.register_do_submit()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    login_do_submit:function () {
      /**
       *  登录
       *  @param Function
       */
      this.submit.loading = true
      this.submit.loginText = '登录中...'

      var url = api.login
      var _this = this
      var param = {
        username: this.loginRuleForm.username,
        password: this.loginRuleForm.pwd
      }

      var callback = function(result){
        _this.submit.loading = false
        _this.submit.loginText = '登录'
        if (result.code !== 200) {
          _this.message(result.msg, 'error')
          return false
        }

        // 存储用户信息
        app.sets('user', result.data)

        // 提示
        _this.message('登录成功', 'success', function() {
          // 刷新
          setTimeout(function() {
            window.location.reload()
          }, 1300)
        })
      }
      app.ajax(url, 'post', param, callback)
    },
    forget_do_submit:function () {
      /**
       *  修改密码
       *  @param Function
       */
     var _this = this
      this.submit.loading = true
      this.submit.forgetText = '信息提交中...'
      var url = api.resetPassword
      var param = {
        mobile: this.forgetRuleForm.mobile,
        password: this.forgetRuleForm.password,
        mobileCode: this.forgetRuleForm.code
      }
      var callback = function(result){
        _this.submit.loading = false
        _this.submit.forgetText = '提交'
        // 提示
        if (result.code !== 200) {
          _this.message(result.message, 'error')
          return false
        }
        _this.message('修改成功', 'success')
        // 登录
        _this.showLogin()
      }

      app.ajax(url, 'post', param, callback)
    },
    register_do_submit:function () {
      /**
       *  注册
       *  @param Function
       */
      this.submit.loading = true
      this.submit.registerText = '信息提交中...'
      var _this = this
      var url = api.register
      var param = {
        mobile: this.registerRuleForm.mobile,
        mobileCode: this.registerRuleForm.code,
        password: this.registerRuleForm.password
      }
      var callback = function(result){
        _this.submit.loading = false
        _this.submit.registerText = '注册'
        if (result.code !== 200) {
          _this.message(result.message, 'error')
          return false
        }
        _this.message('注册成功', 'success')
        // 登录
        _this.showLogin()
      }

      app.ajax(url, 'post', param, callback)
    },
    doGetCode:function (type) {
      /**
       *  注册 - 获取验证码
       *  @param Function
       */
      // 校验部分
      if (this.submit.getCode !== '获取验证码') return false
        var checkMobile
      if (type === '1') {
        checkMobile = this.registerRuleForm.mobile.trim()
      } else if (type === '2') {
        checkMobile = this.forgetRuleForm.mobile.trim()
      }
      
      if (checkMobile === '') {
        this.message('请填写手机号', 'error')
        return false
      } else if (!(/^1[34578]\d{9}$/.test(checkMobile))) {
        this.message('请输入正确的手机号', 'error')
        return false
      }

      var _this = this

      var url = api.sendCode
      var param = {
        mobile: checkMobile,
        type: type
      }
      var callback = function(result){
        if (result.code !== 200) {
          _this.message(result.message, 'error')
          return false
        }

        // 读秒倒计时
        var numTime = 60
        _this.message('验证码发送成功', 'success')
        _this.submit.getCode = '60s'

        var devareTime = function() {
          if (_this.submit.getCode !== '1s' && numTime > 0) {
            numTime--
            _this.submit.getCode = numTime + 's'
          } else {
            window.clearInterval(setCode)
            _this.submit.getCode = '获取验证码'
            numTime = 60
          }
        }
        var setCode = window.setInterval(devareTime, 1000)
      }
      app.ajax(url, 'post', param, callback)
    },
    showLogin:function () {
      /**
       *  登录
       *  @param Function
       */
      this.login = true
      this.forget = false
      this.register = false
      this.submit.formTitle = '登录'
      this.resetForm('loginRuleForm');
    },
    showForget:function () {
      /**
       *  忘记密码
       *  @param Function
       */
      this.forget = true
      this.login = false
      this.register = false
      this.submit.formTitle = '忘记密码'
      this.resetForm('forgetRuleForm');
    },
    showRegister:function () {
      /**
       *  注册
       *  @param Function
       */
      this.register = true
      this.forget = false
      this.login = false
      this.submit.formTitle = '注册'
      this.resetForm('registerRuleForm');
    },
    resetForm:function (formName) {
      /**
       *  重置表单
       *  @param Function
       */
      var _this = this
      setTimeout(function() {
        _this.$refs[formName].resetFields();
      }, 200)
    },
    message:function (text, type, callback) {
      /**
       *  消息提示
       *  @param Function
       */
      if (callback) {
        this.$message({
          message: text,
          type: type,
          duration: 2000,
          onClose: callback()
        })
      } else {
        this.$message({
          message: text,
          type: type
        })
      }
    }
  }
})

module.exports = function (opt) {
    jQuery(opt.regForm).validator({
        login: function (e) {
            if ( e && e.preventDefault )
                //阻止默认浏览器动作(W3C)
                e.preventDefault();
            else
                //IE中阻止函数器默认动作的方式
                window.event.returnValue = false;
                //return false;
            var formValidity = this.isFormValid();

            $.when(formValidity).then(function() {
                // 验证成功的逻辑
                if (formValidity) {
                    $("#getMobileCode").addClass("am-disabled");
                    $("#mobile_register_submit").addClass('am-disabled');
                    var regMobile = $("#reg-mobile").val();
                    var regPwd = $("#reg-pwd").val();
                    var regVerify = $("#reg-verify").val();
                    var url = api.register;
                var param = {
                    mobileCode: regVerify,
                        mobile: regMobile,
                        password: regPwd,
                }
                var callback = function (data) {
                    if (data.code === 200) {
                      app.message(data.message, 'success', function(){
                                window.location.href = "/aldbim/download.html";
                            });
                    } else {
                        $("#getMobileCode").removeClass("am-disabled");
                            $("#mobile_register_submit").removeClass('am-disabled');
                            app.message(data.message, 'danger');
                    }
                }
                alert("12")
                app.ajax(url, 'post', param, callback)
                } else {
                    console.log('submit error');
                }
            }, function() {
                // 验证失败的逻辑
                console.log('submit error');
            });
        }
    });
}