/**
 *
 */


logout = function () {
    sw.Msg.confirm('确认退出', '您确定要退出系统吗？',
        function (btn) {
            if ("yes" == btn) {
                doLogout();
            }
        }
    );
}

function doLogout() {
    window.document.body.onbeforeunload = Ext.emptyFn;// 关闭刷新提示，注：在FireFox下无效
    //IndexMask.show();
    window.location = "login";
    //IndexMask.hide();
}

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
            autoLoad: url,
            url: url,
            method: 'post',
            closable: true
        });
        tab.show();//先显示标签页，再加载内容
        /*tab.load({
            //url: url,
            //method:'post',
            //params: {'tabId':tabId,'id':id},
            //scope: this, // optional scope for the callback
            html:"<iframe scrolling='auto' frameborder='0' width='100%' height='100%' src="+url+"> </iframe>",
            discardUrl: false,
            nocache: true,
            scripts: true
        });*/
    } else {
        tab.show();
    }
}


function loadMenus(obj) {
    var name = Ext.getDom("userName").value;
    sw.ajax.request("menu/getMenus", {parentId: null}, function (result) {
        if (null != result.data && true == result.success) {
            var arr = Ext.decode(result.data);
            var tbItem = obj.getBottomToolbar();
            tbItem.removeAll();
            var bbar = [{
                text: "" + name + "您好！",
                iconCls: 'buser'
            }// 显示用户姓名
            ]
            tbItem.add(bbar);
            getFirstItems(tbItem, arr);
            tbItem.add(['->', {text: '退出系统', iconCls: 'blogout', tooltip: '退出系统', handler: logout}]);
            obj.doLayout();
        }
    });
}


function getFirstItems(tbItem, list) {
    var items = [];
    if (list == null) {
        return items;
    }
    var index = 0;
    for (var i = 0; i < list.length; i++) {
        var obj = list[i];
        var menu = {
            id: obj.idd,
            text: '<font>' + obj.menuName + '</font>',
            currMyMenu: obj,//把菜单对象放入当前对象中
            iconCls: obj.iconCls ? obj.iconCls : 'icon-modify',
            listeners: {
                mouseover: function () {
                    //鼠标悬浮显示菜单
                    this.showMenu();
                }
            }, handler: function () {
                var curObj = this.currMyMenu;
                if (curObj.leaf == "0" && null != curObj.path) {
                    var path = curObj.path;
                    var node = {
                        id: curObj.id,
                        text: curObj.menuName,
                        attributes: {
                            openType: 'TAB',
                            path: path
                        }
                    };
                    sw.util.menuHandle(node);
                }
            }
        };

        //创建下级菜单
        getMenu(obj, menu);
        items[index * 2] = menu;
        if (list.length > 1 && i != (list.length - 1)) {
            items[index * 2 + 1] = '-';
        }
        index++;
    }
    tbItem.add(items);
    //return items;
}

/**
 * 递归创建下级菜单
 */
function getMenu(obj, parentMenu) {

    var list = obj.childMenuModels;
    if (list == null || list.length == 0) {
        return;
    }

    var items = [];
    var index = 0;
    for (var i = 0; i < list.length; i++) {

        var currObj = list[i];
        var menu = {
            id: currObj.id,
            text: currObj.menuName,
            currMyMenu: currObj,//把菜单对象放入当前对象中
            handler: function () {
                var curObj = this.currMyMenu;
                if (curObj.leaf == "0" && null != curObj.path) {
                    var path = curObj.path;
                    var node = {
                        id: curObj.id,
                        text: curObj.menuName,
                        attributes: {
                            openType: 'TAB',
                            path: path
                        }
                    };
                    sw.util.menuHandle(node);
                }
            },
            iconCls: currObj.iconCls ? currObj.iconCls : 'icon-modify'
        };

        //递归创建下级菜单
        getMenu(currObj, menu);

        items[index * 2] = menu;
        if (list.length > 1 && i != (list.length - 1)) {
            items[index * 2 + 1] = '-';
        }
        index++;
    }

    var menu = new Ext.menu.Menu({
        items: items
    });
    parentMenu.menu = menu;
}
