package com.sw.sso.core.login;

import com.sw.sso.core.ssostore.SsoSessionIdHelper;
import com.sw.sso.core.ssouser.SsoUserInfo;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author sw
 * @Title: SsoLoginHelper
 * @ProjectName sso
 * @Description: 登录辅助类
 * @date 19-1-11 下午4:53
 */
public class SsoLoginHelper {
    /**
     * 登录方法
     * @param response　响应
     * @param sessionId　sessionId　
     * @param ssoUserInfo　登录对象
     * @param ifRemember　是否记录
     */
    public static void login(HttpServletResponse response,String sessionId, SsoUserInfo ssoUserInfo,boolean ifRemember){
        String storeKey= SsoSessionIdHelper.pareseStoreKey(sessionId);
        if(null==storeKey){
            throw  new RuntimeException("parese storeKey fail,sessionId:"+sessionId);
        }

    }
}
