package com.mood.module.api.app;


import com.mood.entity.app.App;
import com.mood.module.base.BaseApi;
import com.mood.redis.CacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 应用模块
 * @author chaiwei
 * @time 2018-01-07 下午08:00
 */
@RestController
@RequestMapping("/api/{version}/redis")
public class RedisApi extends BaseApi<App> {

    @Autowired
    private CacheService simpleCacheService;

    @GetMapping("")
    public String getApps(){
        simpleCacheService.set("test","123",1000);
        simpleCacheService.del("test");
        return simpleCacheService.get("test").toString();
    }

}
