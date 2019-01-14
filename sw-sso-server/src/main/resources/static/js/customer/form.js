sw.form = {};//sw表单函数集

/**
 * 自定义表单密码校验
 * @param {Object} val
 * @param {Object} field
 */
Ext.apply(Ext.form.VTypes, {
    password: function (val, field) {//val指这里的文本框值，field指这个文本框组件，大家要明白这个意思
        if (field.confirmTo) {//confirmTo是我们自定义的配置参数，一般用来保存另外的组件的id值
            var pwd = Ext.get(field.confirmTo);//取得confirmTo的那个id的值
            return (val == pwd.getValue());
        }
        return true;
    }
});
/**
 * 用后台传来的值对象给表单赋值
 * @param {Object} formId
 * @param {Object} valueObj
 */
sw.form.setValue = function (formId, valueObj) {
    //Ext.getCmp(formId).getForm().setValues(valueObj);

    var theForm = Ext.getCmp(formId);
    for (var key in valueObj) {
        var value = valueObj[key];
        if (null == value) {
            //alert(key +"="+ value);
            continue;
        }
        var input = Ext.getCmp(key);
        if (input == null) {
            continue;
        }
        var inputType = '';
        try {
            inputType = input.getXType();//input.xtype;
        } catch (e) {
        }
        try {
            //做必要的格式化
            if ('datefield' == inputType) {
                //alert('有日期格式');
                value = sw.util.formatDate(value);
            } else if ('timefield' == inputType) {
                //alert('有时间格式');
                value = sw.util.formatTime(value);
            } else if ('displayfield' == inputType) {
                if ('date' == input.formatType) {
                    value = sw.util.formatDate(value);
                } else if ('time' == input.formatType) {
                    value = sw.util.formatTime(value);
                }
            }
        } catch (e) {
        }//异常
        //log.info(key+"=="+value+"=="+inputType);
        //设值
        if (!Ext.isEmpty(input)) input.setValue(value);
    }

}
/**
 * 创建"所有人"输入项
 * @return {}
 */
sw.form.createEveryOne = function (isChecked) {
    return {
        id: 'everyOne',
        xtype: 'checkbox',
        fieldLabel: '可见性',
        boxLabel: '公开',
        name: 'everyOne',
        checked: isChecked,
        inputValue: 'true'
    };
}
/**
 * 图标
 * @return {}
 */
sw.form.createIconCls = function (iconCls) {
    return {
        id: 'iconCls',
        xtype: 'hidden',
        name: 'iconCls',
        value: iconCls,
        anchor: '95%'
    };
}
/**
 * 版本
 * @return {}
 */
sw.form.createVersion = function () {
    return {
        id: 'version',
        xtype: 'hidden',
        name: 'version',
        anchor: '95%'
    };
}
/**
 * 排序号
 * @return {}
 */
sw.form.createSortIdx = function () {
    return {
        id: 'sortIdx',
        xtype: 'hidden',
        name: 'sortIdx',
        anchor: '95%'
    };
}
sw.form.createVisSortIdx = function (width) {
    return {
        id: 'sortIdx',
        xtype: 'textfield',
        fieldLabel: '排序号',
        name: 'sortIdx',
        anchor: width
    };
}
/**
 * ID
 * @return {}
 */
sw.form.createId = function () {
    return {
        id: 'id',
        xtype: 'hidden',
        name: 'id',
        anchor: '95%'
    };
}
/**
 * 业务状态
 * @param {} state
 * @return {}
 */
sw.form.createState = function (st) {
    return {
        id: 'state',
        xtype: 'hidden',
        name: 'state',
        value: st
    };
}
/**
 * 显示名称
 * @param {} title
 * @return {}
 */
sw.form.createDisplayName = function (title, anchor) {
    if (!anchor) anchor = "95%";
    return {
        id: 'displayName',
        fieldLabel: title,
        allowBlank: false,
        name: 'displayName',
        anchor: anchor
    };
}
/**
 * 系统状态
 * @return {}
 */
sw.form.createStatus = function () {
    return {
        id: 'status',
        xtype: 'hidden',
        //fieldLabel: '状态',
        //boxLabel:'启用',
        name: 'status',
        //checked:true,
        //inputValue:'1'
        value: '1'
    };
}
/**
 * 按给定的参数名称构造查询字符串
 */
sw.form.createQueryString = function (paramNames) {
    //alert(paramNames)
    if (!paramNames) return '';

    var queryString = '';
    for (var i = 0; i < paramNames.length; i++) {
        var paramName = paramNames[i];
        var value = null;
        try {
            value = Ext.getCmp(paramName).getValue();
            //alert(value)
        } catch (e) {
        }
        if (value) {
            queryString += '&' + paramName + '=' + value;
        }
    }
    if (queryString.indexOf('&') == 0) {
        queryString = queryString.substring(1);
    }
    return queryString;
}



