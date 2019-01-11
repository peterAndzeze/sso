package com.sw.sso.server.redis;

import com.sw.sso.server.SwSsoServerApplicationTests;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;

/**
 * @author sw
 * @Title: RedisServerTest
 * @ProjectName sso
 * @Description: TODO
 * @date 19-1-8 下午2:06
 */
public class RedisServerTest extends SwSsoServerApplicationTests {
    @Autowired
    RedisTemplate redisTemplate;
    @Test
    public void getName(){
        System.out.println(redisTemplate);
        Object value=redisTemplate.opsForValue().get("name");
        System.out.println("取值"+value);
        redisTemplate.opsForValue().set("name","张三");
        Object value1=redisTemplate.opsForValue().get("name");
        System.out.println("取值"+value1);

    }
}
