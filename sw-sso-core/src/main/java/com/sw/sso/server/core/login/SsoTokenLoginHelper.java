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
 * @Title: SsoTokenLoginHelper
 * @ProjectName sso
 * @Description: 
 * @date 19-1-14 上午10:40
 */
public class SsoTokenLoginHelper {

    /**
     * client login
     *
     * @param sessionId
     * @param ssoUserInfo
     */
    public static void login(String sessionId, SsoUserInfo ssoUserInfo) {

        String storeKey = SsoSessionIdHelper.pareseStoreKey(sessionId);
        if (storeKey == null) {
            throw new RuntimeException("parseStoreKey Fail, sessionId:" + sessionId);
        }

        SsoLoginStore.put(storeKey, ssoUserInfo);
    }

    /**
     * client logout
     *
     * @param sessionId
     */
    public static void logout(String sessionId) {

        String storeKey = SsoSessionIdHelper.pareseStoreKey(sessionId);
        if (storeKey == null) {
            return;
        }

        SsoLoginStore.remove(storeKey);
    }
    /**
     * client logout
     *
     * @param request
     */
    public static void logout(HttpServletRequest request) {
        String headerSessionId = request.getHeader(SsoConf.SSO_SESSIONID);
        logout(headerSessionId);
    }


    /**
     * login check
     *
     * @param sessionId
     * @return
     */
    public static SsoUserInfo loginCheck(String  sessionId){

        String storeKey = SsoSessionIdHelper.pareseStoreKey(sessionId);
        if (storeKey == null) {
            return null;
        }

        SsoUserInfo ssoUserInfo = SsoLoginStore.get(storeKey);
        if (ssoUserInfo != null) {
            String version = SsoSessionIdHelper.parseVersion(sessionId);
            if (ssoUserInfo.getVersion().equals(version)) {

                // After the expiration time has passed half, Auto refresh
                if ((System.currentTimeMillis() - ssoUserInfo.getExpireFreshTime()) > ssoUserInfo.getExpireMinite()/2) {
                    ssoUserInfo.setExpireFreshTime(System.currentTimeMillis());
                    SsoLoginStore.put(storeKey, ssoUserInfo);
                }

                return ssoUserInfo;
            }
        }
        return null;
    }


    public static SsoUserInfo loginCheck(HttpServletRequest request, HttpServletResponse response){

        String cookieSessionId = CookieUtil.getValue(request, SsoConf.SSO_SESSIONID);

        // cookie user
        SsoUserInfo ssoUserInfo = SsoTokenLoginHelper.loginCheck(cookieSessionId);
        if (ssoUserInfo != null) {
            return ssoUserInfo;
        }

        // redirect user

        // remove old cookie
        SsoTokenLoginHelper.removeSessionIdByCookie(request, response);

        // set new cookie
        String paramSessionId = request.getParameter(SsoConf.SSO_SESSIONID);
        ssoUserInfo = SsoTokenLoginHelper.loginCheck(paramSessionId);
        if (ssoUserInfo != null) {
            CookieUtil.set(response, SsoConf.SSO_SESSIONID, paramSessionId, false);    // expire when browser close （client cookie）
            return ssoUserInfo;
        }

        return null;
    }

    /**
     * client logout, cookie only
     *
     * @param request
     * @param response
     */
    public static void removeSessionIdByCookie(HttpServletRequest request, HttpServletResponse response) {
        CookieUtil.remove(request, response, SsoConf.SSO_SESSIONID);
    }
}
