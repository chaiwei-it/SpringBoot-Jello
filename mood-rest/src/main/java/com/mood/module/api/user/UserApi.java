package com.mood.module.api.user;


import com.mood.base.BaseController;
import com.mood.base.Pager;
import com.mood.common.HttpCode;
import com.mood.entity.user.User;
import com.mood.module.base.BaseApi;
import com.mood.user.service.UserService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 应用模块
 * @author chaiwei
 * @time 2018-01-07 下午08:00
 */
@RestController
@RequestMapping("/api/{version}/user")
public class UserApi extends BaseController {

    @Autowired
    private UserService userService;

    /**
     * 添加
     * @param user
     * @return
     */
    @PostMapping("")
    public ResponseEntity<ModelMap> create(@ModelAttribute User user,
                                           ModelMap modelMap, HttpServletRequest request){
        Integer result = userService.insert(user);
        if(result > 0){
            return setSuccessModelMap(modelMap,user);
        }
        return setModelMap(modelMap,HttpCode.INTERNAL_SERVER_ERROR);
    }

    /**
     * 修改
     * @param user
     * @return
     */
    @PutMapping("/{id}")
    public ResponseEntity<ModelMap> update(@PathVariable(value = "id", required = false) String id,
                          @ModelAttribute User user,
                          ModelMap modelMap, HttpServletRequest request){
        user.setId(id);
        Integer result = userService.update(user);
        if(result > 0){
            return setSuccessModelMap(modelMap,user);
        }
        return setModelMap(modelMap, HttpCode.INTERNAL_SERVER_ERROR);
    }

    /**
     * 删除
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ModelMap> delete(@PathVariable(value = "id", required = false) String id,
                          ModelMap modelMap, HttpServletRequest request){
        Integer result = userService.deleteById(id);
        if(result > 0){
            return setSuccessModelMap(modelMap);
        }
        return setModelMap(modelMap, HttpCode.INTERNAL_SERVER_ERROR);
    }

    /**
     * 详情
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public ResponseEntity<ModelMap> select(@PathVariable(value = "id", required = false) String id,
                             ModelMap modelMap, HttpServletRequest request){
        User user = userService.selectById(id);
        return setSuccessModelMap(modelMap,user);
    }

    /**
     * 列表
     * @param userName
     * @return
     */
    @GetMapping("")
    public ResponseEntity<ModelMap> list(@RequestParam(value = "userName", required = false, defaultValue = "") String userName,
                           ModelMap modelMap, HttpServletRequest request){
        JSONObject param = new JSONObject();
        if(!userName.equals("")){
            param.put("userName",userName);
        }
        List<User> list = userService.selectAll(param);
        return setSuccessModelMap(modelMap,list);
    }

    /**
     * 分页
     * @param pageIndex
     * @param pageSize
     * @param userName
     * @return
     */
    @GetMapping("pager")
    public ResponseEntity<ModelMap> pager(@RequestParam(value = "pageIndex",required = false,  defaultValue = "1") Integer pageIndex,
                                          @RequestParam(value = "pageSize",required = false,  defaultValue = "20") Integer pageSize,
                                          @RequestParam(value = "userName", required = false, defaultValue = "") String userName,
                                          ModelMap modelMap, HttpServletRequest request){
        Pager<User> pager = new Pager<User>(pageIndex, pageSize);
        JSONObject param = new JSONObject();
        if(userName.equals("")){
            param.put("userName",userName);
        }
        pager.setParams(param);
        pager = userService.selectPager(pager);
        return setSuccessModelMap(modelMap,pager);
    }

}
