package com.sw.sso.server.core.ssouser;

/**
 * @author sw
 * @Title: SsoUserInfo
 * @ProjectName sso
 * @Description:　sso user info
 * @date 19-1-11 下午3:33
 */
public class SsoUserInfo {
    private String userId;
    private String userName;
    private String version;
    private long expireFreshTime;
    private int expireMinite;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public long getExpireFreshTime() {
        return expireFreshTime;
    }

    public void setExpireFreshTime(long expireFreshTime) {
        this.expireFreshTime = expireFreshTime;
    }

    public int getExpireMinite() {
        return expireMinite;
    }

    public void setExpireMinite(int expireMinite) {
        this.expireMinite = expireMinite;
    }
}
