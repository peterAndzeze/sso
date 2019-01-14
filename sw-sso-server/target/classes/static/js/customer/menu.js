sw.menu = {};

sw.menu.createBtn = function (title, icon, func, id) {
    if (!id) id = Ext.id();
    return {
        id: id,
        text: title,
        iconCls: icon,
        handler: func
    }
}