package com.sw.sso.server.controller;

import com.sw.sso.server.core.config.SsoConf;
import com.sw.sso.server.core.login.SsoLoginHelper;
import com.sw.sso.server.core.ssostore.SsoLoginStore;
import com.sw.sso.server.core.ssostore.SsoSessionIdHelper;
import com.sw.sso.server.core.ssouser.SsoUserInfo;
import com.sw.sso.server.core.vo.ReturnMsgUtil;
import com.sw.sso.server.user.model.UserModel;
import com.sw.sso.server.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.UUID;

/**
 * @author sw
 * @Title: WebController
 * @ProjectName sso
 * @Description: 页面登录
 * @date 19-1-11 下午3:50
 */
@Controller
public class WebController {
    static {
        System.out.println("我初始化了＆＆＆＆＆＆＆＆＆＆＆＆＆＆＆＆＆＆＆＆＆＆＆");
    }
    @Autowired
    private UserService userService;

    /**
     * 首页登录
     * @param request
     * @param response
     * @return
     */
    @RequestMapping("/")
    public String index(Model model,HttpServletRequest request, HttpServletResponse response){
        SsoUserInfo ssoUserInfo= SsoLoginHelper.loginCheck(request,response);
        if(null==ssoUserInfo){
            return "redirect:login";
        }
        model.addAttribute("ssoUser",ssoUserInfo);
        return "index";
    }

    @RequestMapping(SsoConf.SSO_LOGIN)
    public String login(Model model,HttpServletRequest request,HttpServletResponse response){
        SsoUserInfo ssoUserInfo=SsoLoginHelper.loginCheck(request,response);
        if(null!=ssoUserInfo){
            String redirectUrl=request.getParameter(SsoConf.REDIRECT_URL);
            if(null!=redirectUrl && redirectUrl.trim().length()>0){
                if(redirectUrl.endsWith("/")){
                    redirectUrl=redirectUrl.substring(0,redirectUrl.length()-1);
                }
                String sessionId=SsoLoginHelper.getSessionIdByCookie(request);
                String redirectUrlFinal=redirectUrl+"?"+SsoConf.SSO_SESSIONID+"="+sessionId;
                return "redirect:"+redirectUrlFinal;
            }else{
                return "redirect:/";
            }
        }
        model.addAttribute("errorMsg",request.getParameter("errorMsg"));
        model.addAttribute(SsoConf.REDIRECT_URL,request.getParameter(SsoConf.REDIRECT_URL));
        return "login";
    }

    @RequestMapping("/doLogin")
    public String doLogin(HttpServletRequest request, HttpServletResponse response,
                          RedirectAttributes redirectAttributes, UserModel userModel, String ifRemember){
        boolean ifRem=(ifRemember!=null && "on".equals(ifRemember))?true:false;
        ReturnMsgUtil<UserModel> infoReturnMsgUtil=userService.findUser(userModel.getUserName(),userModel.getUserPassWord());
        if(infoReturnMsgUtil.getCode()!=ReturnMsgUtil.SUCCESS_CODE){
            redirectAttributes.addAttribute("errorMsg",infoReturnMsgUtil.getMsg());
            redirectAttributes.addAttribute(SsoConf.REDIRECT_URL,request.getParameter(SsoConf.REDIRECT_URL));
            return "redirect:/login";
        }
        SsoUserInfo ssoUserInfo=new SsoUserInfo();
        ssoUserInfo.setUserId(String.valueOf(infoReturnMsgUtil.getData().getId()));
        ssoUserInfo.setUserName(infoReturnMsgUtil.getData().getUserName());
        ssoUserInfo.setVersion(UUID.randomUUID().toString().replace("-",""));
        ssoUserInfo.setExpireMinite(SsoLoginStore.getRedisExpireMinite());
        ssoUserInfo.setExpireFreshTime(System.currentTimeMillis());
        String sessionId= SsoSessionIdHelper.makeSessionId(ssoUserInfo);
        SsoLoginHelper.login(response,sessionId,ssoUserInfo,ifRem);
        String redirectUrl=request.getParameter(SsoConf.REDIRECT_URL);
        if(null!=redirectUrl && redirectUrl.trim().length()>0){
            if(redirectUrl.endsWith("/")){
                redirectUrl=redirectUrl.substring(0,redirectUrl.length()-1);
            }
            redirectAttributes.addAttribute(SsoConf.SSO_SESSIONID,sessionId);
            System.out.println("************"+redirectUrl);
            return  "redirect:"+redirectUrl;
        }else{
            return "redirect:/";
        }
    }

    /**
     * 退出
     * @return
     */
    @RequestMapping(SsoConf.SSO_LOGINOUT)
    public String loginout(HttpServletRequest request,HttpServletResponse response,RedirectAttributes redirectAttributes){
        SsoLoginHelper.loginout(request,response);
        redirectAttributes.addAttribute(SsoConf.REDIRECT_URL,request.getParameter(SsoConf.REDIRECT_URL));
        return "redirect:/login";
    }

}
