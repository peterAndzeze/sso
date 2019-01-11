package com.sw.sso.core.ssostore;

import com.sw.sso.core.config.SsoConf;
import com.sw.sso.core.redis.RedisService;
import com.sw.sso.core.springcontext.SpringContextUtil;
import com.sw.sso.core.ssouser.SsoUserInfo;

import java.util.concurrent.TimeUnit;

/**
 * @author sw
 * @Title: SsoLoginStore
 * @ProjectName sso
 * @Description: 登录存放数据
 * @date 19-1-11 下午5:27
 */
public class SsoLoginStore {

    private static int redisExpireMinite = 1440;    // 1440 minite, 24 hour
    public static void setRedisExpireMinite(int redisExpireMinite) {
        if (redisExpireMinite < 30) {
            redisExpireMinite = 30;
        }
        SsoLoginStore.redisExpireMinite = redisExpireMinite;
    }


    protected static RedisService getRedisService(){
        return  SpringContextUtil.getBeanByClass(RedisService.class);
    }
    /**
     * 存放sessionId
     * @param storeKey
     * @param ssoUserInfo
     */
    public static void put(String storeKey, SsoUserInfo ssoUserInfo){
        String redisKey=redisKey(storeKey);
        getRedisService().putValue(redisKey,ssoUserInfo,redisExpireMinite*60, TimeUnit.SECONDS);
    }

    private static String redisKey(String sessionId){
        return SsoConf.SSO_SESSIONID.concat("#").concat(sessionId);
    }


}
