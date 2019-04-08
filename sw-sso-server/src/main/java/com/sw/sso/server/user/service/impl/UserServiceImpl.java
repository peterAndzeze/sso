package com.sw.sso.server.user.service.impl;

import com.sw.sso.server.user.model.UserModel;
import com.sw.sso.server.user.service.UserService;
import org.springframework.stereotype.Service;
import com.sw.sso.server.core.vo.ReturnMsgUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @author sw
 * @Title: UserServiceImpl
 * @ProjectName sso
 * @Description: TODO
 * @date 19-1-11 下午4:17
 */
@Service
public class UserServiceImpl implements UserService {
    /**
     * 模拟数据
     */
    private static List<UserModel> mockUserList = new ArrayList<>();

    static {
        for (long i = 0; i < 5; i++) {
            UserModel UserModel = new UserModel();
            UserModel.setId((1000 + i));
            UserModel.setUserName("user" + (i > 0 ? String.valueOf(i) : ""));
            UserModel.setUserPassWord("123456");
            mockUserList.add(UserModel);
        }
    }

    /**
     * 查询用户
     *
     * @param userName
     * @param userPassWord
     * @return
     */
    @Override
    public ReturnMsgUtil<UserModel> findUser(String userName, String userPassWord) {
        if (null == userName || userName.trim().length() == 0) {
            return new ReturnMsgUtil<>(ReturnMsgUtil.FAIL_CODE, "please input username");
        }
        if (null == userPassWord || userPassWord.trim().length() == 0) {
            return new ReturnMsgUtil<>(ReturnMsgUtil.FAIL_CODE, "please input userpassword");
        }
        Optional<UserModel> userModel = mockUserList.stream().filter(e -> e.getUserName().equals(userName) && e.getUserPassWord().equals(userPassWord)).findFirst();

        return new ReturnMsgUtil<>(userModel.get());
    }

    public static void main(String[] args) {
        List<UserModel> userModels = new ArrayList<>();
        UserModel u1 = new UserModel();
        u1.setUserName("112");
        u1.setUserPassWord("12");
        userModels.add(u1);
        Optional<UserModel> userModel = userModels.stream().filter(e -> e.getUserPassWord().equals("12")).findFirst();
        System.out.println(userModel.get().getUserName());
    }
}
