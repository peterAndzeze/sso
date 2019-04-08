package com.sw.sso.demo.controller;

import com.sw.sso.server.core.config.SsoConf;
import com.sw.sso.server.core.ssouser.SsoUserInfo;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

/**
 * @author sw
 * @Title: IndexController
 * @ProjectName sso
 * @Description: demo登录
 * @date 19-1-15 上午9:58
 */
@Controller
public class IndexController {
    static {
        System.out.println("demo controller init************************ ");
    }

    @RequestMapping("/")
    public String index(Model model, HttpServletRequest request) {
        System.out.println("我是第一个方法进来了吗");
        SsoUserInfo ssoUserInfo = (SsoUserInfo) request.getAttribute(SsoConf.SSO_USER);
        model.addAttribute("ssoUserInfo", ssoUserInfo);
        return "index";
    }

}
