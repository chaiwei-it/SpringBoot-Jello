package com.mood.module.api.user;

import com.mood.base.BaseController;
import com.mood.common.HttpCode;
import com.mood.common.UserContants;
import com.mood.entity.user.User;
import com.mood.redis.CacheService;
import com.mood.user.service.UserService;
import com.mood.utils.Digests;
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

    @Autowired
    private CacheService cacheService;

    @Autowired
    private UserService userService;

    /**
     * 登录
     * @param username
     * @param password
     * @return
     */
    @PostMapping("/login")
    public Object login(@RequestParam(value = "username", defaultValue = "")String username,
                        @RequestParam(value = "password", defaultValue = "")String password,
                        ModelMap modelMap){
        //验证已经登陆的次数
        Integer loginNumber = cacheService.getInteger(UserContants.LOGINNUMBER + username);
        if(loginNumber > UserContants.LOGINERRORNUMBER){
            return setModelMap(modelMap,HttpCode.LOGIN_DISABLED);
        }
        //验证是否已经登录
//        String loginStatus = cacheService.getString(UserContants.LOGINSTATUS + username);
//        if(loginStatus != null){
//            return setModelMap(modelMap,HttpCode.LOGIN_ONLINE);
//        }
        //验证用户是否存在
        User user = userService.selectByUsername(username);
        if(user == null){
            cacheService.set(UserContants.LOGINNUMBER + username, loginNumber++, 15000);
            return setModelMap(modelMap,HttpCode.LOGIN_NEVER_USER);
        }
        //判断用户是否停用
        if(user.getDelStatus() == 2){
            return setModelMap(modelMap,HttpCode.LOGIN_USER_STATE);
        }
        //验证密码是否正确
        Boolean isValidate = Digests.validPassword(password, user.getPassword());
        if(!isValidate){
            cacheService.set(UserContants.LOGINNUMBER + username, loginNumber + 1 + "", 15000);
            Integer a = cacheService.getInteger(UserContants.LOGINNUMBER + username);
            return setModelMap(modelMap, HttpCode.LOGIN_ERROR, loginNumber);
        }
        cacheService.set(UserContants.LOGINSTATUS + username, "1", 1000000);
        return setModelMap(modelMap, HttpCode.SUCCESS, user);

    }


    @PostMapping("logout")
    public Object logout(ModelMap modelMap, HttpServletRequest request){
        return setModelMap(modelMap, HttpCode.SUCCESS);
    }

    /**
     * 注册
     * @param username
     * @param password
     * @return
     */
    @PostMapping("/register")
    public Object register(@RequestParam(value = "username", defaultValue = "")String username,
                           @RequestParam(value = "password", defaultValue = "")String password,
                           ModelMap modelMap, HttpServletRequest request) {
        //验证用户是否存在
        User user = userService.selectByUsername(username);
        if(user != null){
            return setModelMap(modelMap,HttpCode.REGISTER_HAVE_USER);
        }
        user = new User();
        user.setUsername(username);
        user.setPassword(Digests.getEncryptedPwd(password));
        userService.insert(user);
        return setModelMap(modelMap, HttpCode.SUCCESS);

    }

}
