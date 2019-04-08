package com.sw.sso.server.core.login;

import com.sw.sso.server.core.config.SsoConf;
import com.sw.sso.server.core.ssostore.SsoLoginStore;
import com.sw.sso.server.core.ssostore.SsoSessionIdHelper;
import com.sw.sso.server.core.ssouser.SsoUserInfo;
import com.sw.sso.server.core.util.CookieUtil;

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
     *
     * @param response    　响应
     * @param sessionId   　sessionId
     * @param ssoUserInfo 　登录对象
     * @param ifRemember  　是否记录
     */
    public static void login(HttpServletResponse response, String sessionId, SsoUserInfo ssoUserInfo, boolean ifRemember) {
        String storeKey = SsoSessionIdHelper.pareseStoreKey(sessionId);
        if (null == storeKey) {
            throw new RuntimeException("parese storeKey fail,sessionId:" + sessionId);
        }
        SsoLoginStore.put(storeKey, ssoUserInfo);
        CookieUtil.set(response, SsoConf.SSO_SESSIONID, sessionId, ifRemember);
    }

    /**
     * 退出登录
     *
     * @param request
     * @param response
     */
    public static void loginout(HttpServletRequest request, HttpServletResponse response) {
        String cookieSessionId = CookieUtil.getValue(request, SsoConf.SSO_SESSIONID);
        if (null == cookieSessionId) {
            return;
        }
        String storeKey = SsoSessionIdHelper.pareseStoreKey(cookieSessionId);
        if (null != storeKey) {
            SsoLoginStore.remove(storeKey);
        }
        CookieUtil.remove(request, response, SsoConf.SSO_SESSIONID);
    }

    /**
     * 检查当前浏览器是否已经登录
     *
     * @param request
     * @param response
     * @return
     */
    public static SsoUserInfo loginCheck(HttpServletRequest request, HttpServletResponse response) {
        String cookieSessionId = CookieUtil.getValue(request, SsoConf.SSO_SESSIONID);
        SsoUserInfo ssoUserInfo = SsoTokenLoginHelper.loginCheck(cookieSessionId);
        if (null != ssoUserInfo) {
            return ssoUserInfo;
        }
        //remove old
        SsoLoginHelper.removeSessionIdByCookie(request, response);
        String paramsSessionId = request.getParameter(SsoConf.SSO_SESSIONID);
        ssoUserInfo = SsoTokenLoginHelper.loginCheck(paramsSessionId);
        if (null != ssoUserInfo) {
            CookieUtil.set(response, SsoConf.SSO_SESSIONID, paramsSessionId, false);
            return ssoUserInfo;
        }
        return null;
    }

    /**
     * 删除客户端
     *
     * @param request
     * @param response
     */
    public static void removeSessionIdByCookie(HttpServletRequest request, HttpServletResponse response) {
        CookieUtil.remove(request, response, SsoConf.SSO_SESSIONID);
    }

    /**
     * 获取
     *
     * @param request
     * @return
     */
    public static String getSessionIdByCookie(HttpServletRequest request) {
        String cookieSessionId = CookieUtil.getValue(request, SsoConf.SSO_SESSIONID);
        return cookieSessionId;
    }


}
