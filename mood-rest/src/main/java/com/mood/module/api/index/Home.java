package com.mood.module.api.index;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

/**
 * 应用模块
 * @author chaiwei
 * @time 2017-11-25 下午08:00
 */
@Controller
@RequestMapping("/")
public class Home {

    @RequestMapping("index")
    public String getApps(HttpServletRequest request){

        return "/page/index/index";
    }

}
