package com.sw.sso.server.core.login;

import com.sw.sso.server.core.config.SsoConf;
import com.sw.sso.server.core.ssostore.SsoLoginStore;
import com.sw.sso.server.core.ssostore.SsoSessionIdHelper;
import com.sw.sso.server.core.ssouser.SsoUserInfo;

import javax.servlet.http.HttpServletRequest;

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

        SsoUserInfo xxlUser = SsoLoginStore.get(storeKey);
        if (xxlUser != null) {
            String version = SsoSessionIdHelper.parseVersion(sessionId);
            if (xxlUser.getVersion().equals(version)) {

                // After the expiration time has passed half, Auto refresh
                if ((System.currentTimeMillis() - xxlUser.getExpireFreshTime()) > xxlUser.getExpireMinite()/2) {
                    xxlUser.setExpireFreshTime(System.currentTimeMillis());
                    SsoLoginStore.put(storeKey, xxlUser);
                }

                return xxlUser;
            }
        }
        return null;
    }


    /**
     * login check
     *
     * @param request
     * @return
     */
    public static SsoUserInfo loginCheck(HttpServletRequest request){
        String headerSessionId = request.getHeader(SsoConf.SSO_SESSIONID);
        return loginCheck(headerSessionId);
    }
}
