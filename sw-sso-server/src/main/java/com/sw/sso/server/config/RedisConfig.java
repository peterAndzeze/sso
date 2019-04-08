package com.sw.sso.server.config;

import com.sw.sso.server.core.ssostore.SsoLoginStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * @author sw
 * @Title: RedisConfig
 * @ProjectName sso
 * @Description: 初始化redis信息
 * @date 19-1-8 上午11:37
 */
@Configuration
public class RedisConfig {

    @Value("${sw.sso.redis.expire.minite}")
    private int redisExpireMinite;


    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, String> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        redisTemplate.afterPropertiesSet();
        //顺便初始化
        SsoLoginStore.setRedisExpireMinite(redisExpireMinite);
        return redisTemplate;
    }
}
