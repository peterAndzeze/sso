package com.sw.sso.server.core.ssostore;

import com.alibaba.fastjson.JSON;
import com.sw.sso.server.core.config.SsoConf;
import com.sw.sso.server.core.redis.RedisService;
import com.sw.sso.server.core.springcontext.SpringContextUtil;
import com.sw.sso.server.core.ssouser.SsoUserInfo;

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

    public static int getRedisExpireMinite() {
        return redisExpireMinite;
    }


    protected static RedisService getRedisService() {
        return SpringContextUtil.getBeanByClass(RedisService.class);
    }

    /**
     * 存放sessionId
     *
     * @param storeKey
     * @param ssoUserInfo
     */
    public static void put(String storeKey, SsoUserInfo ssoUserInfo) {
        String redisKey = redisKey(storeKey);
        getRedisService().putValue(redisKey, JSON.toJSONString(ssoUserInfo), redisExpireMinite * 60, TimeUnit.SECONDS);
    }

    /**
     * 取数据
     *
     * @param storeKey
     * @return
     */
    public static SsoUserInfo get(String storeKey) {
        String redisKey = redisKey(storeKey);
        Object objectValue = getRedisService().getValue(redisKey);
        if (null != objectValue) {
            return JSON.parseObject(String.valueOf(objectValue), SsoUserInfo.class);
        }
        return null;
    }

    /**
     * 删除数据
     *
     * @param storeKey
     */
    public static void remove(String storeKey) {
        String redisKey = redisKey(storeKey);
        getRedisService().remove(redisKey);
    }


    private static String redisKey(String sessionId) {
        return SsoConf.SSO_SESSIONID.concat("#").concat(sessionId);
    }


}
