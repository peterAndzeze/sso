package com.sw.sso.server.core.filter;

import com.sw.sso.server.core.config.SsoConf;
import com.sw.sso.server.core.login.SsoTokenLoginHelper;
import com.sw.sso.server.core.path.impl.AntPathMatcher;
import com.sw.sso.server.core.ssouser.SsoUserInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.sw.sso.server.core.vo.ReturnMsgUtil;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author sw
 * @Title: SsoTokenFilter
 * @ProjectName sso
 * @Description: TODO
 * @date 19-1-14 下午12:12
 */
public class SsoTokenFilter extends HttpServlet implements Filter {
    private static Logger logger= LoggerFactory.getLogger(SsoTokenFilter.class);
    private static final AntPathMatcher antPathMatcher=new AntPathMatcher();
    private String ssoServer;
    private String loginoutPath;
    private String excludedPaths;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        ssoServer=filterConfig.getInitParameter(SsoConf.SSO_SERVER);
        loginoutPath=filterConfig.getInitParameter(SsoConf.SSO_LOGINOUT_PATH);
        excludedPaths=filterConfig.getInitParameter(SsoConf.SSO_EXCLUDED_PATHS);
        logger.info("sw sso filter inint....");
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request=(HttpServletRequest)servletRequest;
        HttpServletResponse response=(HttpServletResponse)servletResponse;
        String servletPath=request.getServletPath();
        System.out.println("/servletPath*************"+servletPath);
        if(excludedPaths!=null && excludedPaths.trim().length()>0){
            for(String excludePath:excludedPaths.split(",")){
                String uriPattern=excludePath.trim();
                if(antPathMatcher.match(uriPattern,servletPath)){
                    filterChain.doFilter(request,response);
                }
            }
        }
        if(null!=loginoutPath && loginoutPath.trim().length()>0 && servletPath.endsWith(loginoutPath)){
            SsoTokenLoginHelper.removeSessionIdByCookie(request,response);
            String loginoutUrl=ssoServer.concat(SsoConf.SSO_LOGINOUT);
            response.sendRedirect(loginoutUrl);
            return;
        }

        SsoUserInfo ssoUserInfo=SsoTokenLoginHelper.loginCheck(request,response);
            if(null==ssoUserInfo){
           /* response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().println("{\"code\":"+SsoConf.SSO_LOGIN_FAIL_RESULT.getCode()+", \"msg\":\""+ SsoConf.SSO_LOGIN_FAIL_RESULT.getMsg() +"\"}");*/
           String link=request.getRequestURL().toString();
            String loginPageUrl=ssoServer.concat(SsoConf.SSO_LOGIN)+"?"+SsoConf.REDIRECT_URL+"="+link;
                System.out.println("loginPageUrl*********"+loginPageUrl);
            response.sendRedirect(loginPageUrl);
            return;
        }
        servletRequest.setAttribute(SsoConf.SSO_USER,ssoUserInfo);
        filterChain.doFilter(servletRequest,servletResponse);
        return;
    }

    @Override
    public void destroy() {

    }
}
