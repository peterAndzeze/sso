package com.sw.sso.demo.config;

import com.sw.sso.server.core.config.SsoConf;
import com.sw.sso.server.core.filter.SsoTokenFilter;
import com.sw.sso.server.core.ssostore.SsoLoginStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * @author sw
 * @Title: SsoConfig
 * @ProjectName sso
 * @Description: 测试客户端
 * @date 19-1-15 上午9:45
 */
@Configuration
public class SsoConfig {
    @Value("${sw.sso.redis.expire.minite}")
    private int redisExpireMinite;
    @Value("${sso.server.path}")
    private String ssoServer;
    @Value("${sso.loginout.path}")
    private String ssoLoginOutPath;
    @Value("${sso.excluded.paths}")
    private String ssoExcludedPaths;


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

    /**
     * 注册拦截器
     *
     * @return
     */
    @Bean
    public FilterRegistrationBean ssoFilterRegistration() {
        FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean();
        filterRegistrationBean.setName("ssoFilter");
        filterRegistrationBean.setOrder(1);
        filterRegistrationBean.addUrlPatterns("/*");
        filterRegistrationBean.setFilter(new SsoTokenFilter());
        filterRegistrationBean.addInitParameter(SsoConf.SSO_SERVER, ssoServer);
        filterRegistrationBean.addInitParameter(SsoConf.SSO_LOGINOUT_PATH, ssoLoginOutPath);
        filterRegistrationBean.addInitParameter(SsoConf.SSO_EXCLUDED_PATHS, ssoExcludedPaths);
        return filterRegistrationBean;
    }


}
