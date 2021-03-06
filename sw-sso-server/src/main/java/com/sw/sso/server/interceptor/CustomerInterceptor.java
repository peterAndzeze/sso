package com.sw.sso.server.interceptor;

import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author sw
 * @Title: CustomerInterceptor
 * @ProjectName sso
 * @Description: 拦截器　过滤静态资源
 * @date 19-1-14 下午4:01
 */
@Component
public class CustomerInterceptor implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**").addResourceLocations(ResourceUtils.CLASSPATH_URL_PREFIX + "/static/");
    }

}
