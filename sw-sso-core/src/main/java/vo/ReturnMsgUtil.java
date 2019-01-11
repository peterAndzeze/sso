package vo;

/**
 * @author sw
 * @Title: ReturnMsgUtil
 * @ProjectName sso
 * @Description: 返回消息
 * @date 19-1-11 下午3:42
 */
public class ReturnMsgUtil<T> {
    public static final long serialVersionUID = 42L;

    public static final int SUCCESS_CODE = 200;
    public static final int FAIL_CODE = 500;
    public static final ReturnMsgUtil<String> SUCCESS = new ReturnMsgUtil<String>(null);
    public static final ReturnMsgUtil<String> FAIL = new ReturnMsgUtil<String>(FAIL_CODE, null);

    private int code;
    private String msg;
    private T data;

    public ReturnMsgUtil(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }
    public ReturnMsgUtil(T data) {
        this.code = SUCCESS_CODE;
        this.data = data;
    }

    public int getCode() {
        return code;
    }
    public void setCode(int code) {
        this.code = code;
    }
    public String getMsg() {
        return msg;
    }
    public void setMsg(String msg) {
        this.msg = msg;
    }
    public T getData() {
        return data;
    }
    public void setData(T data) {
        this.data = data;
    }

}
