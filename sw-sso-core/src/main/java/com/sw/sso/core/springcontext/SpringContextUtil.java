package com.sw.sso.core.springcontext;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component
public class SpringContextUtil implements ApplicationContextAware {

    private static ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {

        SpringContextUtil.applicationContext=applicationContext;
    }

    public static ApplicationContext getApplicationContext(){
        return applicationContext;
    }

    /**
     * 获取
     * @param t
     * @param <T>
     * @return
     */
    public static <T> T getBeanByClass(Class<T> t){
        return applicationContext.getBean(t);
    }

    /**
     * 根据名字
     * @param beanName
     * @param <T>
     * @return
     */
    public static <T> T getBeanByNames(String beanName){
        return (T) applicationContext.getBean(beanName);
    }
}
