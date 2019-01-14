sw.panel = {};

sw.panel.tools = {};

/**
 * 面板刷新
 */
sw.panel.refresh = function (panel) {
    try {
        var inner = Ext.DomQuery.selectNode('iframe', Ext.get(panel.id).dom);
        if (inner) {//使用iframe时
            var src = inner.src;
            //alert(src)
            inner.src = src;
        } else if (panel.getUpdater()) {//使用panel时
            var url = panel.getUpdater().defaultUrl;
            //alert(url);
            panel.load({
                url: url,
                scripts: true,
                nocache: true
            });
        } else if (panel.autoLoad) {//使用autoLoad时
            var url = panel.autoLoad.url;
            //alert(url);
            panel.load({
                url: url,
                scripts: true,
                nocache: true
            });
        }
    } catch (e) {
        sw.Msg.warn('抱歉，该标签页不支持刷新');
    }
};

/**
 * 面板右上角工具－刷新
 */
sw.panel.tools.refresh = function () {
    return {
        id: 'refresh',
        handler: function (e, target, panel) {
            sw.panel.refresh(panel);
        }
    };
};