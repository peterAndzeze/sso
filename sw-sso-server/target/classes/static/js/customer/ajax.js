sw.ajax = {};//sw的ajax函数集

//sw_ajax_isStoped = false;//标识服务器是否已停止
sw.ajax.retryTimeout = null;//重试定时器引用

sw.ajax.ERROR_INTERNET_TIMEOUT = 12002;
sw.ajax.ERROR_INTERNET_NAME_NOT_RESOLVED = 12007;
sw.ajax.ERROR_INTERNET_CANNOT_CONNECT = 12029;
sw.ajax.ERROR_INTERNET_CONNECTION_ABORTED = 12030;
sw.ajax.ERROR_INTERNET_CONNECTION_RESET = 12031;
sw.ajax.ERROR_HTTP_INVALID_SERVER_RESPONSE = 12152;

/**
 * 以post形式向url发送params，成功后调用callback
 * @param {Object} url
 * @param {Object} params
 * @param {Object} callback
 */
sw.ajax.request = function (url, params, callback, isMask, failCallback) {
    if (!isMask) isMask = false;
    if (isMask) sw.Msg.showMask();

    Ext.Ajax.request({
        url: url,
        method: 'post',
        params: params,
        waitTitle: loadTitle,
        waitMsg: loadMsg,
        timeout: AJAX_TIMEOUT,
        success: function (response, form) {
            try {
                //处理session失效
                if (response.responseText.indexOf(logoutUrl) >= 0) {
                    if (!sw_ajax_isStoped) {//防止多次提示session失效信息
                        sw_ajax_isStoped = true;
                        msg.stop();
                        var logout = confirm(sessionInvalidMsg);
                        if (logout) doLogout();
                    }
                    return;
                }

                //常规处理
                //alert('status='+response.status);
                eval('var result = ' + response.responseText);//在IE下Ext.decode方法对function无效
                if (null != result.success && !result.success) {
                    if (failCallback) {
                        failCallback(result);
                    } else {
                        sw.Msg.warn(result.msg);
                        if (sw.Msg.mainMask) sw.Msg.mainMask.hide();
                        //callback(false);
                    }
                } else {
                    callback(result);
                }
            } catch (e) {
                //alert(e.message);
                //log.error('ajax error: '+e.message+'\nresponse='+response.responseText);
            }
            if (isMask) sw.Msg.hideMask();
        },
        failure: function (response, form) {
            //alert('response.status='+response.status);
            if (isMask) sw.Msg.hideMask();
            //处理服务器重启造成session失效的问题
            if (0 == response.status || 500 == response.status || 503 == response.status
                || sw.ajax.ERROR_INTERNET_CANNOT_CONNECT == response.status) {

                sw.Msg.info("与服务器的通讯中断, 请刷新列表或联系管理员 !");
                window.document.body.onbeforeunload = Ext.emptyFn;
                //window.location = ctxPath+'/jsp/info.jsp';
                return;

                if (!sw_ajax_isStoped) {
                    sw.ajax.stopClient();
                }
            } else {
                log.error('错误信息如下：');
                for (var key in response) {
                    log.debug(key + '=' + response[key]);
                }
                try {
                    if (response.responseText) {
                        log.error('错误信息：\n' + response.responseText);
                    }
                } catch (e) {
                }
            }
        }
    });
};
/**
 * 停止客户端（应对服务器停止响应）
 */
sw.ajax.stopClient = function () {
    sw_ajax_isStoped = true;
    //msg.stop();
    if (null != sw.Msg.msgBox) sw.Msg.msgBox.hide();
    sw.Msg.wait(serverOffMsg);
    //sw.ajax.retryTimeout = window.setTimeout(sw.ajax.detectServer,msg.refreshTime);
    sw.ajax.detectServer();
};
/**
 * 探测服务器状态
 */
/*sw.ajax.detectServer = function(){
	var localUrl = ctxPath+'/jsp/info.jsp';
	sw.ajax.fragment(localUrl, {}, function(text,response){
		if(200==response.status){
			var url = casServerUrl+'/login?service='+encodeURIComponent(serverUrl)+'/j_spring_cas_security_check';
			sw.util.openIframeDialog(sw_ajax_loginDialogId,url,'buser',1024,550,'请登录',true,true,false);
		}
	},false,function(response){
		sw.ajax.retryTimeout = window.setTimeout(sw.ajax.detectServer,5*1000);
	});
};*/
/**
 * 启动客户端（服务器开始响应后启动）
 */
sw.ajax.startClient = function (winId) {
    //sw.Msg.hideMask();
    window.clearTimeout(sw.ajax.retryTimeout);
    //msg.start();
    Ext.getCmp(winId).close();
    //sw.Msg.info(serverOnMsg,null,10000);
    if (null != sw.Msg.msgBox) sw.Msg.msgBox.hide();
    sw.Msg.notice(null, serverOnMsg, 5000, 300);
    sw_ajax_isStoped = false;
};
/**
 * 以ajax形式向url提交id为formId的表单，成功后调用callback
 * @param {Object} url
 * @param {Object} formId
 * @param {Object} callback
 */
sw.ajax.submit = function (url, formId, callback, failedCallback) {
    if (!failedCallback) failedCallback = Ext.emptyFn();
    Ext.getCmp(formId).form.doAction('submit', {
        url: url,
        method: 'post',
        waitTitle: loadTitle,
        waitMsg: loadMsg,
        reset: false,//是否清空表单
        timeout: AJAX_TIMEOUT,
        clientValidation: true,
        success: function (form, action) {
            if (callback) callback(action.result);
        },
        failure: function (form, action) {
            if (failedCallback) {
                failedCallback(action.result);
            } else {
                if (action.failureType != 'client') {
                    sw.Msg.error(action.result.msg);
                }
            }
        }
    });
};
/**
 * 以post形式向url发送params，成功后调用callback
 * @param {Object} url
 * @param {Object} params
 * @param {Object} callback
 */
sw.ajax.fragment = function (url, params, callback, isMask, failCallback) {
    if (!isMask) isMask = false;
    var mask = null;
    if (isMask) {
        var mask = new Ext.LoadMask(Ext.getBody(), {msg: loadMsg});
        mask.show();
    }

    Ext.Ajax.request({
        url: url,
        method: 'post',
        params: params,
        waitTitle: loadTitle,
        waitMsg: loadMsg,
        timeout: AJAX_TIMEOUT,
        success: function (response, form) {
            if (callback) callback(response.responseText, response);
            if (isMask) {
                mask.hide();
            }
        },
        failure: function (response) {
            if (failCallback) failCallback(response);
            if (isMask) {
                mask.hide();
            }
        }
    });
};