var width = Ext.getBody().getWidth();
console.log(Ext.get("userName"));
Ext.onReady(function () {
    var mainTabPanel = new Ext.TabPanel({
        id: 'mainTabPanel',
        title: '主功能区',
        region: 'center',
        deferredRender: true,
        enableTabScroll: true,
        resizeTabs: false,
        tabWidth: 90,
        activeTab: 0,
        plugins: new Ext.ux.TabCloseMenu(),
        defaults: {
            autoScroll: true
        }//,     //   plugins: new Ext.ux.TabCloseMenu(),

    });

    var dictTree = new Ext.tree.TreePanel({
        region: 'west',
        //title:'管理',
        width: 200,
        useArrows: false,//为true时, lines属性无效
        autoScroll: true,
        //autoHeight:true,
        //height:1000,
        animate: true,
        containerScroll: true,
        border: false,
        lines: true,
        loader: new Ext.tree.TreeLoader({
            dataUrl: "menu/getMenusTree",
            baseParams: {"id": 0},
            listeners: {
                'beforeload': function (loader, node) {
                    if (node.isRoot) {
                        this.baseParams.id = 0;
                    } else {
                        this.baseParams.id = node.id
                    }
                }
            }
        }),
        listeners: {
            "click": function (node) {
                if (node.attributes.leaf) {
                    var tabId = "tab-" + node.attributes.id;
                    var tabs = Ext.getCmp("mainTabPanel");
                    var path = node.attributes.path;
                    var tab = Ext.getCmp(tabId);
                    if (!tab) {//不存在

                        tab = tabs.add({
                            id: tabId,
                            layout: 'fit',
                            xtype: 'panel',
                            closeAction: 'hide', //隐藏不关闭  
                            'title': node.attributes.text,
                            closable: true,
                            html: ' <iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="' + path + '"> </iframe>'

                            //url:path,
                            //autoLoad:path
                            //html : "<iframe scrolling='auto' frameborder='0' width='100%' height='100%' src='dictionary/main.html'></iframe>"
                        });
                        //tabs.load();
                        //alert(path+"--"+Ext.getCmp(path));
                        /*tabs.getItem(tab).add(Ext.getCmp(path));
                        tabs.setActiveTab(tab);*/
                        tab.show()
                        //tabs.add(tab);
                    } else {
                        tabs.unhideTabStripItem(Ext.getCmp(tabId).show());
                        //tabs.setActiveTab(tab);
                    }
                }
            }
        },
        rootVisible: false,
        root: new Ext.tree.AsyncTreeNode({
            //nodeType: 'async',
            text: "管理功能",
            draggable: false
        })
    });

    currentNode = dictTree.getRootNode();
    dictTree.getRootNode().expand();
    var viewport = new Ext.Viewport({
        layout: {
            type: 'border',
            padding: '5'
        },
        items: [new Ext.Panel({
            region: 'north',
            frame: false,
            border: true,
            height: 30,
            id: 'topPanel',
            bbar: ['->', {
                text: Ext.get("userName").dom.value + " 您好！",
                iconCls: 'buser'
            }		// 显示用户姓名
                , {
                    text: '退出系统',
                    iconCls: 'blogout',
                    tooltip: '退出系统',
                    handler: logout
                }]
        }), dictTree, mainTabPanel, {
            region: 'south',
            collapsible: false,
            html: '<div class="footer" style="text-align:center">© 新开普电子股份有限公司 2018</div>',
            split: false,
            height: 22
        }]
    });
});

// 关闭主界面的遮罩
/*console.log(IndexMask);
 if (null != IndexMask) {
 IndexMask.hide();
 }*/

/*if (userName == "oldoper") {
 sw.Msg.warn('当前登录用户没有操作权限,请重新登录', function() {
 doLogout();
 });
 }*/
function openForWarn(node, url, name, flag) {
    var tabId = 'tab-' + node;
    var tabs = Ext.getCmp(mainTabPanelId);
    var tab = tabs.getItem(tabId);
    if (undefined != tab) {
        sw.util.closeFromMainTab(tabId);
    }
    if (undefined != tab) {
        sw.util.closeFromMainTab(tabId);
    }
    sw.util.openTab(node, url, '', 'mainTabPanel', name);
}

/**
 * 增加tab
 */
/*function addTab(node) {
 var nowTab = Ext.getCmp("tab_" + node.id);
 if (null != nowTab && undefined != nowTab) {
 Ext.getCmp("MainTabPanel").setActiveTab(nowTab);
 return;
 }
 var url;
 if ("1" == node.id) {
 url = "dictionary/main"
 } else if ("2" == node.id) {
 url = ""
 }
 var tab = Ext.getCmp("MainTabPanel").add({
 id : "tab_" + node.id,
 title : node.text,
 layout : 'fit',
 closable : true,
 html : '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src='
 + node.url + ' id=_tabcontent_' + node.id + '></iframe>'
 }).show();
 }*/
