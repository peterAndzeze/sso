package com.sw.sso.server.user.model;

/**
 * @author sw
 * @Title: UserModel
 * @ProjectName sso
 * @Description: 暂时
 * @date 19-1-11 下午4:11
 */
public class UserModel {

    private Long id;
    private String userName;
    private String userPassWord;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserPassWord() {
        return userPassWord;
    }

    public void setUserPassWord(String userPassWord) {
        this.userPassWord = userPassWord;
    }
}
