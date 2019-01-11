package com.sw.sso.core.redis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * @author sw
 * @Title: RedisService
 * @ProjectName sso
 * @Description: redis操作
 * @date 19-1-10 下午4:39
 */
@Service
public class RedisService {
    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * 插入
     *
     * @param key
     * @param value
     */
    public void putValue(String key, Object value) {
        redisTemplate.opsForValue().set(key, value);
    }

    /**
     *
     * @param key
     * @param value
     * @param expire
     * @param timeUnit 存放时间
     */
    public void putValue(String key,Object value,int expire,TimeUnit timeUnit){
       redisTemplate.opsForValue().set(key,value,expire,timeUnit);
    }

    /**
     * 取
     * @param key
     */
    public Object getValue(String key){
        return redisTemplate.opsForValue().get(key);
    }








}
