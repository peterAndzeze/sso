package com.sw.sso.server.core.ssostore;

import com.sw.sso.server.core.ssouser.SsoUserInfo;

/**
 * @author sw
 * @Title: SsoSessionIdHelper
 * @ProjectName sso
 * @Description: session 辅助类
 * @date 19-1-11 下午5:14
 */
public class SsoSessionIdHelper {
    /**
     * 组装出的sessionId
     * @param ssoUserInfo
     * @return
     */
    public static String makeSessionId(SsoUserInfo ssoUserInfo){
        String sessionId=ssoUserInfo.getUserId().concat("_").concat(ssoUserInfo.getVersion());
        return sessionId;
    }
    /**
     * 解析存储的userid 从sessionId
     * @param sessionId
     * @return
     */
    public static String pareseStoreKey(String sessionId){
        if(null!=sessionId && sessionId.indexOf("_")>-1){
            String [] sessionIdArr=sessionId.split("_");
            if(sessionIdArr.length==2 && sessionIdArr[0]!=null && sessionIdArr[0].trim().length()>0){
                String userId=sessionIdArr[0].trim();
                return userId;
            }
        }
        return null;
    }

    /**
     * 解析version　from session
     * @param sessionId
     * @return
     */
    public static String parseVersion(String sessionId){
        if(null!=sessionId && sessionId.trim().length()>0){
            String [] sessionIdArr=sessionId.split("_");
            if(sessionIdArr.length==2 && null!=sessionIdArr[1] && sessionIdArr[1].trim().length()>0){
               return sessionIdArr[1];
            }
        }
        return null;
    }


}
