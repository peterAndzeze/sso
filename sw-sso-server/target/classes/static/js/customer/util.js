sw.util = {};

sw.util.winMgr = {};
sw.util.winMgr.wins = new Array();

sw.util.dialogMgr = {};
sw.util.dialogMgr.set = {};
/**
 * 将时间数字格式化成日期格式
 * @param {Object} timeNum
 */
sw.util.formatDate = function (timeNum) {
    if (null == timeNum) return '';
    if (!(timeNum instanceof Number)) {
        timeNum = parseInt(timeNum);
    }
    var date = new Date(timeNum);
    return date.format('Y-m-d');
}
/**
 * 将时间数字格式化成时间格式
 * @param {Object} timeNum
 */
sw.util.formatTime = function (timeNum) {
    if (null == timeNum) return '';
    if (!(timeNum instanceof Number)) {
        timeNum = parseInt(timeNum);
    }
    var date = new Date(timeNum);
    timeNum = timeNum - date.format('Z') * 1000;
    date = new Date(timeNum);
    return date.format('H:i:s');
}
/**
 * 将时间数字格式化成日期时间格式
 * @param {Object} timeNum
 */
sw.util.formatDateTime = function (timeNum) {
    if (null == timeNum) return '';
    if (!(timeNum instanceof Number)) {
        timeNum = parseInt(timeNum);
    }
    var date = new Date(timeNum);
    return date.format('Y-m-d H:i:s');
}
/**
 * 将时间数字格式化成日期时间格式，精确到毫秒
 * @param {Object} timeNum
 */
sw.util.formatDateTimeMs = function (timeNum) {
    if (null == timeNum) return '';
    if (!(timeNum instanceof Number)) {
        timeNum = parseInt(timeNum);
    }
    var date = new Date(timeNum);
    return date.format('Y-m-d H:i:s.u');
}
/**
 * 将时间字符串格式化成日期时间格式
 * @param {Object} timeNum
 */
sw.util.parseDateTime = function (dateTime) {
    if (null == dateTime) return '';
    var date = Date.parseDate(dateTime, 'Y-m-d H:i:s');
    return date;
}
/**
 * 格式化数据类型-指定显示精度
 */
sw.util.formatNumberFixed = function (num, fraction, unit) {
    /*try{
        num = parseFloat(num);
    } catch(e){
        return num;
    }
    return num.toFixed(fraction);*/
    if (!unit) {
        unit = '';
    }
    return accounting.formatMoney(num, unit, fraction);
}
/**
 * moneyToNumber
 */
sw.util.formatMoneyFixed = function (num) {
    return accounting.unformat(num);
}
/**
 * 面板高度自适应
 * @param {Object} containerId
 * @param {Object} panel
 * 不建议使用
 */
sw.util.fitPanelSize = function (panel, container) {
    window.onresize = function () {
        panel.setWidth(0);
        panel.setHeight(0);

        var width = container.getWidth();
        var height = container.getHeight();
        panel.setWidth(width);
        panel.setHeight(height);
    };
}
/**
 * 本地预览图片
 * 注意，必须设置class="picPreview"
 * @param {} id
 * @param {} path
 */
sw.util.picPreview = function (id, path, style) {
    try {//仅IE下有效
        Ext.get(id).dom.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = path;
    } catch (e) {//兼容其它浏览器
        Ext.get(id).dom.innerHTML = '<img src="' + path + '" style="' + style + '"/>';
    }
}

/**
 * 构造菜单树
 * @param {Object} rootText
 * @param {Object} rootId
 */
sw.util.openSubOnMainMenu = function (menuPanelId, subContainerId, rootText, rootId, iconCls) {
    Ext.get(subContainerId).dom.innerHTML = "";
    var panel = Ext.getCmp(menuPanelId);
    panel.setTitle(rootText, iconCls);

    var menuTree = new Ext.tree.TreePanel({
        el: subContainerId,
        lines: true,
        useArrows: false,//为true时, lines属性无效
        autoScroll: true,
        autoHeight: false,
        height: panel.getInnerHeight(),
        animate: true,
        containerScroll: false,
        border: false,
        loader: new Ext.tree.TreeLoader({
            dataUrl: menuUrl
        }),
        rootVisible: false,
        root: {
            nodeType: 'async',
            text: rootText,
            id: rootId
        },
        tbar: [
            {
                text: '展开', iconCls: 'barrowdown', handler: function () {
                    menuTree.getRootNode().expand(true);
                }
            },
            {
                text: '合拢', iconCls: 'barrowup', handler: function () {
                    menuTree.getRootNode().collapse(true);
                }
            }

        ]
    });
    var menuSorter = new Ext.tree.TreeSorter(menuTree, {
        dir: 'asc',
        caseSensitive: true,
        //folderSort:true,
        property: 'sortIdx'
    });
    menuTree.on('click', function (node, e) {
        sw.util.menuHandle(node);
    });
    menuTree.render();
    menuTree.getRootNode().expand();
    menuTree.expandAll();
    /*
    Ext.getCmp('main_menu').items.each(function(it){
        it.hide();
    });*/
    //Ext.getCmp(rootId).show();
    return menuTree;
}

/**
 * 统一处理菜单动作
 */
sw.util.menuHandle = function (node) {
    var path = node.attributes.path;
    if (null != path && path.trim().length > 0 && '#' != path) {
        var openType = node.attributes.openType;
        switch (openType) {
            case 'TAB':
                sw.util.openTab(node.id, node.attributes.path, node.attributes.iconCls, 'mainTabPanel', node.text);
                break;
            case 'IF_TAB':
                var globalPath = globalBasePath + node.attributes.path;
                sw.util.openIframeTab(node.id, globalPath, node.attributes.iconCls, 'mainTabPanel', node.text);
                break;
            case 'IF_TAB_NL':
                sw.util.openIframeTab(node.id, node.attributes.path, node.attributes.iconCls, 'mainTabPanel', node.text, true);
                break;
            case 'NEW_WIN':
                var win = sw.util.openWin(node.attributes.path, node.text);
                break;
            case 'DIALOG':
                sw.util.openDialog(node.id, node.attributes.path, {}, node.attributes.iconCls, node.attributes.width, node.attributes.height, node.text);
                break;
            case 'PAGE_DIALOG':
                sw.util.openPageDialog(node.id, node.attributes.path, {}, node.attributes.iconCls, node.attributes.width, node.attributes.height, node.text, true);
                break;
            case 'IF_DIALOG':
                sw.util.openIframeDialog(node.id, node.attributes.path, node.attributes.iconCls, node.attributes.width, node.attributes.height, node.text);
                break;
            case 'DY_DIALOG':
                sw.util.openDynamicDialog(node.id, node.attributes.path, {}, node.attributes.iconCls, node.text);
                break;
            case 'METHOD':
                eval(node.attributes.path);
                break;
            default:
                sw.util.openTab(node.id, node.attributes.path, node.attributes.iconCls, 'mainTabPanel', node.text);
                break;
        }
    }
}

/**
 * 向指定的标签面板中添加标签页
 * ID标识, 唯一
 * @param {Object} id
 */
sw.util.openTab = function (id, url, iconCls, parentId, title) {
    if (!iconCls) iconCls = 'tabs';
    if (!parentId) parentId = mainTabPanelId;
    //alert(parentId)
    if (!title) title = id;
    var tip = '<b>' + title + '</b>';
    title = sw.text.trunk(title);
    url = url;
    var tabId = 'tab-' + id;
    var tabs = Ext.getCmp(parentId);
    var tab = tabs.getItem(tabId);
    if (undefined == tab) {
        tab = tabs.add({
            id: tabId,
            title: title,
            tabTip: tip,
            iconCls: iconCls,
            autoScroll: true,
            //html:content,
            //autoLoad:url,
            closable: true
        });
        tab.show();//先显示标签页，再加载内容

        tab.load({
            url: url,
            method: 'post',
            params: {'tabId': tabId, 'id': id},
            //scope: this, // optional scope for the callback
            discardUrl: false,
            nocache: true,
            text: tabLoadMsg,
            timeout: AJAX_TIMEOUT,
            scripts: true
        });
    } else {
        tab.show();
    }
}
/**
 * 打开一个新的Tab，用Iframe打开指定的url
 */
sw.util.openIframeTab = function (id, url, iconCls, parentId, title, noLoading) {
    if (!iconCls) iconCls = 'tabs';
    if (!parentId) parentId = mainTabPanelId;
    //alert(parentId)
    if (!title) title = id;
    var tip = '<b>' + title + '</b>';
    title = sw.text.trunk(title);
    //alert(title);
    //url = url;
    var frameId = 'frame-' + id;
    //var mainTabPanel = Ext.get(mainTabPanelId);
    var width = '100%';
    var height = '100%';
    var frameUrl = '<iframe id="' + frameId + '" src="' + sw.util.addUrlParam(url, {loading_id: id}) + '" width="' + width + '" height="' + height + '" frameBorder="0" style="margin:0px;padding:0px;"></iframe>';
    if (!noLoading) {
        frameUrl = '<div id="' + iframeLoadingPrefix + id
            + '" style="padding:5px;width:200px;" class="loading-indicator">&nbsp;&nbsp;'
            + tabLoadMsg + '</div>' + frameUrl;
    }
    //alert(frameUrl);
    var tabId = 'tab-' + id;
    var tabs = Ext.getCmp(parentId);
    var tab = tabs.getItem(tabId);
    if (undefined == tab) {
        tab = tabs.add({
            id: tabId,
            title: title,
            tabTip: tip,
            iconCls: iconCls,
            autoScroll: false,
            html: frameUrl,
            //autoLoad:url,
            closable: true
        });
        tab.show();//先显示标签页，再加载内容
    } else {
        tab.show();
    }
}
/**
 * 打开新(浏览器)窗口
 * @param {Object} url
 * @param {Object} title
 */
sw.util.openWin = function (url, title) {
    //var sFeature = 'location=no,resizable=yes,menubar=no,scrollbars=yes,status=no,titlebar=no,toolbar=no,top=0,left=0,width=1015,height=700';
    //var sFeature = 'location=no,resizable=yes,menubar=no,scrollbars=yes,status=no,titlebar=no,toolbar=no,top=0,left=0,width='+iWidth+',height='+iHeight;
    var sFeature = '';
    var win = window.open(url, '_blank', sFeature);
    try {
        win.focus();
    } catch (e) {
    }
    return win;
}
/**
 * 打开组件对话框，内容是组件
 * @param {Object} url
 * @param {Object} title
 */
sw.util.openDialog = function (id, items, iconCls, width, height, title, focusId, notShow, maximizable) {
    var rtn = Ext.getCmp(id);
    if (rtn) {
        return rtn;
    }

    //mainStatusBar.showBusy();
    //alert('sw.util.openDialog: 打开对话框');
    var waitMask = sw.Msg.waitMask();
    if (!iconCls) iconCls = 'tabs';
    if (!title) title = id;
    //id = 'Dialog_'+id;//该行会引起items内含按钮无法关闭窗口的问题。
    if (!iconCls) iconCls = 'bcolumns';
    if (maximizable == undefined) {
        maximizable = false;
    }
    var dialog = new Ext.Window({
        id: id,
        title: title,
        width: width,
        height: height,
        iconCls: iconCls,
        constrainHeader: true,
        plain: false,
        modal: true,
        border: true,
        bodyStyle: 'padding:5px;',
        layout: 'fit',
        resizable: false,
        maximizable: maximizable,
        //minimizable:true,
        autoScroll: true,
        items: items
    });
    waitMask.hide();
    if (!notShow) dialog.show();

    //sw.util.dialogMgr.set[id] = dialog;
    //mainStatusBar.addItem({text:'abc',xtype:'button'});
    if (focusId) {
        //alert('focus:'+focusId);
        Ext.getCmp(focusId).focus(true, 50);
    }

    //mainStatusBar.clearStatus();
    return dialog;
}
/**
 * 打开对话框，内容从服务端取得的动态组件
 * @param {Object} url
 * @param {Object} title
 */
sw.util.openDynamicDialog = function (id, url, params, iconCls, title) {
    var rtn = Ext.getCmp(id);
    if (rtn) return rtn;

    //alert('sw.util.openDialog: 打开对话框');
    var waitMask = sw.Msg.waitMask();
    if (!iconCls) iconCls = 'tabs';
    if (!title) title = id;
    id = 'DynamicDialog_' + id;
    //alert('id='+id);
    if (!iconCls) iconCls = 'bcolumns';
    sw.ajax.request(url, params, function (result) {
        if (result.success == false) {
            sw.Msg.error(result.msg);
        } else {
            var rtnMap = result(id);
            var items = rtnMap.items;
            var width = rtnMap.width;
            var height = rtnMap.height;
            var dialog = new Ext.Window({
                id: id,
                title: title,
                width: width,
                height: height,
                iconCls: iconCls,
                constrainHeader: true,
                plain: false,
                modal: true,
                autoScroll: true,
                resizable: false,
                bodyStyle: 'padding:5px',
                //maximizable:true,
                items: items
            });
            dialog.show();
        }
        waitMask.hide();
    });
}
/**
 * 打开页面对话框，内容是url指向的页面
 * @param {Object} url
 * @param {Object} title
 */
sw.util.openPageDialog = function (id, url, params, iconCls, width, height, title, isModal, maximizable, autoScroll) {
    var rtn = Ext.getCmp(id);
    if (rtn) return rtn;

    //alert('sw.util.openDialog: 打开对话框');
    //var waitMask = sw.Msg.waitMask();
    if (maximizable == undefined) {
        maximizable = false;
    }
    if (autoScroll == undefined) {
        autoScroll = false;
    }
    if (!title) title = id;
    id = 'PageDialog_' + id;
    if (!iconCls) iconCls = 'bcolumns';
    params.id = id;

    var dialog = new Ext.Window({
        id: id,
        renderTo: Ext.getBody(),
        iconCls: iconCls,
        title: title,
        width: width,
        height: height,
        constrainHeader: true,
        bodyStyle: 'padding:0px;background-color:white',
        layout: 'fit',
        //plain: true,
        maximizable: maximizable,
        autoScroll: autoScroll,
        resizable: false,
        modal: isModal
    });
    dialog.show();

    dialog.load({
        url: url,
        method: 'post',
        params: params,
        discardUrl: false,
        nocache: true,
        text: tabLoadMsg,
        timeout: AJAX_TIMEOUT,
        scripts: true
    });

    //waitMask.hide();
    return dialog;
}
/**
 * 打开一个对话框，内容是一个iframe
 * @param {} id
 * @param {} url
 * @param {} width
 * @param {} height
 * @param {} title
 */
sw.util.openIframeDialog = function (id, url, iconCls, width, height, title, disableScrollBar, isModal, isClosable) {
    var rtn = Ext.getCmp(id);
    if (rtn) return rtn;

    var widthIn = '100%';
    var heightIn = '100%';
    if (!iconCls) iconCls = 'tabs';
    var scrollBar = 'auto';
    if (disableScrollBar) {
        scrollBar = 'no';
    }
    if (isClosable == undefined) {
        isClosable = true;
    }
    var formWin = new Ext.Window({
        id: id,
        renderTo: Ext.getBody(),
        iconCls: iconCls,
        title: title,
        width: width,
        height: height,
        constrainHeader: true,
        maximizable: false,
        bodyStyle: 'padding:0px;background-color:white',
        layout: 'fit',
        //plain: true,
        modal: isModal,
        closable: isClosable,
        items: [
            {
                xtype: 'label',
                html: '<iframe src="' + url + '" width="' + widthIn + '" height="' + heightIn + '" frameBorder="0" scrolling="' + scrollBar + '"></iframe>'
            }
        ]
    });
    formWin.show();
    return formWin;
}
/**
 * 修改标签页的标题
 * @param {} id
 * @param {} title
 * @param {} parentId
 */
sw.util.changeTabTitle = function (id, title, parentId) {
    if (!parentId) parentId = mainTabPanelId;
    //var tip = '<b>'+title+'</b>';
    title = sw.text.trunk(title);

    var tabId = 'tab-' + id;
    var tabs = Ext.getCmp(parentId);
    var tab = tabs.getItem(tabId);
    try {
        tab.setTitle(title);
    } catch (e) {
    }
    //tab.setTabTip(tip);
}
/**
 * 修改Iframe页的标题
 * @param {} id
 * @param {} title
 * @param {} parentId
 */
sw.util.changeDialogFrameTitle = function (id, title) {
    var tabId = id;
    var tab = Ext.getCmp(tabId);
    //alert(tab)
    try {
        tab.setTitle(title);
    } catch (e) {
    }
}
/**
 * 关闭对话框
 * @param {} id
 */
sw.util.closeDialog = function (id) {
    var dia = Ext.getCmp(id);
    if (dia) dia.close();
}
/**
 * 设置标签页的图标样式
 * @param {} id
 * @param {} iconCls
 * @param {} parentId
 */
sw.util.setTabIcon = function (id, iconCls, parentId) {
    try {
        if (!parentId) parentId = mainTabPanelId;
        var tabs = Ext.getCmp(parentId);
        var tabId = 'tab-' + id;
        var tab = tabs.getItem(tabId);
        if (tab) tab.setIconClass(iconCls);
    } catch (e) {
    }
}
/**
 * 从主标签面板中关闭标签页
 * @param {} tagId
 */
sw.util.closeFromMainTab = function (tabId) {
    var mainTab = Ext.getCmp(mainTabPanelId);
    mainTab.items.each(function (item) {
        if (tabId == item.id) {
            mainTab.remove(item);
        }
    });
}
/**
 * 关闭标签面板中的所有可关闭的标签页
 * @param {} parent
 */
sw.util.closeAllTabs = function (parent) {
    parent.items.each(function (item) {
        if (item.closable) {
            parent.remove(item);
        }
    });
}
/**
 * 关闭标签面板中的除当前页外的所有可关闭的标签页
 * @param {} parent
 */
sw.util.closeOtherTabs = function (curTab, parent) {
    parent.items.each(function (item) {
        if (curTab != item && item.closable) {
            parent.remove(item);
        }
    });
}
/**
 * 改变主题
 * @param {Object} theme
 */
sw.util.changeTheme = function (theme, currentTheme) {
    sw.ajax.request(changeThemeUrl, {'theme': theme}, function (result) {
        var basePath = "/pub/lib/Ext2/resources";
        if (!theme || '' == theme) {
            theme = 'default';
            Ext.util.CSS.removeStyleSheet("theme");
        } else {
            Ext.util.CSS.swapStyleSheet("theme", basePath + "/css/xtheme-" + theme + ".css");
        }

        document.getElementById('mainBanner').style.backgroundImage = "url('" + basePath + "/images/" + theme + "/banner_bg.gif')";
        document.getElementById('mainBanner_pic').src = basePath + "/images/" + theme + "/banner_dadao.png";

        sw.Msg.info('界面色调已切换');
    });

}
/**
 * 取文件的扩展名
 * @param {} fileName
 * @return {String}
 */
sw.util.getExtName = function (fileName) {
    if (fileName.indexOf(".") < 1) {
        return "";
    }
    return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
}
/**
 * 从路径中取得文件名
 * @param {} filePath
 */
sw.util.getFileName = function (filePath) {
    //alert(filePath)
    if (!filePath) return null;
    var fileName = "";

    fileName = filePath.substring(filePath.lastIndexOf("/") + 1);

    return fileName;
}
/**
 * 判断是否是指定的格式
 * @param {} extName
 * @param {} fileTypes
 * @return {Boolean}
 */
sw.util.isFileType = function (fileName, fileTypes) {
    var extName = sw.util.getExtName(fileName);
    for (var i = 0; i < fileTypes.length; i++) {
        var type = fileTypes[i];
        if (type == extName.toLowerCase()) {
            return true;
        }
    }
    return false;
}
/**
 * portal刷新
 */
sw.util.refreshPortal = function (portalId) {
    var portal = Ext.getCmp(portalId);
    var url = portal.autoLoad.url;
    //alert(url);
    portal.load({url: url, scripts: true, nocache: true});
}
/**
 * 取全路径的首根路径
 * 例/root/abc/def => /root
 * @param {} fullPath
 * @return {}
 */
sw.util.findRoot = function (fullPath) {
    if (fullPath.lastIndexOf('/') == 0) return fullPath;

    var rel = fullPath.substring(1);
    return fullPath.substring(0, rel.indexOf('/') + 1);
}
/**
 * 为url添加参数
 * @param {} url
 * @param {} params map形式的参数对象
 */
sw.util.addUrlParam = function (url, params) {
    if (url.indexOf('?') < 0) {
        var i = 0;
        for (var key in params) {
            var value = params[key];
            if (0 == i) {
                url += '?';
            } else {
                url += '&';
            }
            url += key + '=' + value;
            ++i;
        }
    } else {
        for (var key in params) {
            var value = params[key];
            url += '&' + key + '=' + value;
        }
    }
    return url;
};

/**
 * 将金额格式化为大写格式
 * @param money
 */
sw.util.money2Capital = function (money) {

    money = money.replace(/,/g, '');

    if (money >= 10000 * 100000000) {
        return '一万亿+';
    }

    var nums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    var units = ['分', '角', '元', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟', '万'];

    money = Math.round(money * 100);

    if (money < 1) {
        return '零元整';
    }

    var result = '';

    for (var i = 0; money > 0; i++, money = (money - money % 10) / 10) {
        result = nums[money % 10] + units[i] + result;
    }

    return result.replace(/(零[分角拾佰仟])+/g, '零')
        .replace(/零?零([亿万元])/g, '$1')
        .replace(/^壹拾/, '拾')
        .replace(/零+$/, '')
        .replace(/元$/, '元整');
};