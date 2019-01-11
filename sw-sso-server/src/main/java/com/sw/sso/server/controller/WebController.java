package com.sw.sso.server.controller;

import com.sw.sso.core.ssouser.SsoUserInfo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author sw
 * @Title: WebController
 * @ProjectName sso
 * @Description: 页面登录
 * @date 19-1-11 下午3:50
 */
@Controller
public class WebController {
    /**
     * 首页登录
     * @param request
     * @param response
     * @return
     */
    @RequestMapping("/")
    public String index(HttpServletRequest request, HttpServletResponse response){
        SsoUserInfo ssoUserInfo=
    }


}
