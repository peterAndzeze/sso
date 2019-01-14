package com.sw.sso.server.user.service;

import com.sw.sso.server.user.model.UserModel;
import com.sw.sso.server.core.vo.ReturnMsgUtil;

/**
 * 用户service
 */
public interface UserService {
    /**
     * 查找用户
     * @param userName
     * @param userPassWord
     * @return
     */
    public ReturnMsgUtil<UserModel> findUser(String userName, String userPassWord);
}
