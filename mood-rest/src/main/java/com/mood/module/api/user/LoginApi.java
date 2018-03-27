package com.mood.module.api.user;

import com.mood.base.BaseController;
import com.mood.common.HttpCode;
import com.mood.redis.CacheService;
import com.mood.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * 内容
 * @author chaiwei
 * @time 2018-01-07 下午08:00
 */
@RestController
@RequestMapping("/api/{version}")
public class LoginApi extends BaseController {

//    @Autowired
//    CacheServiceInteger cacheServiceInteger:  = null;
//
//    @Autowired
//    MessageCloudService messageCloudService = null;

    @Autowired
    private CacheService cacheService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Object accessToken(@RequestParam(value = "username", defaultValue = "")String username,
                              @RequestParam(value = "password", defaultValue = "")String password,
                              ModelMap modelMap, HttpServletRequest request) {
        //验证已经登陆的次数

        //验证是否已经登录

        //验证用户是否存在
        userService.selectByUsername(username);
        //验证密码是否正确

        //

        //

        return setModelMap(modelMap, HttpCode.SUCCESS);
    }


    @PostMapping("logout")
    public Object  logout(ModelMap model, HttpServletRequest request){
        return null;
    }

}
