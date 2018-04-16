var app = require("app");
var api = require("app/api");
var easemobim = window.easemobim
$(function(){
	//nav Highlight
    var curpage = window.location.pathname;
    var isHome = true
    $('.am-nav').find('li').each(function() {
        var name = $(this).attr('name');
        if (curpage.indexOf(name) !== -1) {
            isHome = false
            $(this).addClass('on').siblings().removeClass('on');
        }
        if (isHome) {
            $('.am-nav').find('li[name="index"]').addClass('on');
        }
    });

    $('.am-dropdown-content').find('li').each(function() {
        var href = $(this).find('a').prop('href');
        if (curpage === '/partner/designer.html') {
            curpage = $('.am-dropdown-content li[name=partner] a').prop('href');
        }
        if (href && href.indexOf(curpage) !== -1) {
            $(this).addClass('am-active').siblings().removeClass('am-active');
        }
    })

    // 用户信息
    var user = app.gets('user');
    if (user) {
        $('.unlogin').hide()
        $('.user-info').show();
        if (user.avatar.indexOf('http://') !== -1) {
            $('.user_avatar').prop('src', user.avatar)
        } else {
            $('.user_avatar').prop('src', api.IMAGE_DOMAIN + user.avatar)
        }
        user.truename ? $('.user_name').text(user.truename) : $('.user_name').text(user.name)
    }

    // 客服
    $('#kefu').click(function() {
        var form = {};
        if (user) {
            form.userNickname = user.truename ? user.truename : name;
            form.trueName =  user.truename ? user.truename : name;
            form.phone = user.name;
            form.description = '';
        }
        console.log('form：：：：：：', form);
        easemobim.bind({
            tenantId: 42486,
            visitor: form
        });
    })
})


