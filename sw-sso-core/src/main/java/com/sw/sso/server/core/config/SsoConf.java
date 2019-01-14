package com.sw.sso.server.core.config;

import com.sw.sso.server.core.vo.ReturnMsgUtil;

/**
 * @author sw
 * @Title: SsoConf
 * @ProjectName sso
 * @Description: 基础配置信息
 * @date 19-1-11 下午3:35
 */
public class SsoConf {
    /*
        sessionid标识
     */
    public static final String SSO_SESSIONID="sw_sso_sessionId";
    /**
     * redirect url
     */
    public static final String REDIRECT_URL="redirect_url";
    /**
     * sso user 请求中的标识
     */
    public static final String SSO_USER="sso_user";

    /**
     * sso server 服务地址
     */
    public static final String SSO_SERVER="sso_server";
    /**
     * 登录url
     */
    public static final String SSO_LOGIN="/login";
    /**
     * 退出　url
     */
    public static final String SSO_LOGINOUT="/loginout";
    /**
     * loginout path
     */
    public static final String SSO_LOGINOUT_PATH="SSO_LOOUT_PATH";
    /**
     * 过滤路径
     */
    public static final String SSO_EXCLUDED_PATHS = "SSO_EXCLUDED_PATHS";


    /**
     * login fail result
     */
    public static final ReturnMsgUtil<String> SSO_LOGIN_FAIL_RESULT = new ReturnMsgUtil(501, "sso not login.");

}
