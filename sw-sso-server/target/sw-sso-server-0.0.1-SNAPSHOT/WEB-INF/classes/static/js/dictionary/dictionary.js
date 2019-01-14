var pageSize = 20;
var width = parent.width - 220;
var height = parent.height - 80;
// 查询条件
var searchParams = {
    key: null
};

// 清空查询条件
function clearSearch() {
    for (var key in searchParams) {
        var sk = 'search_' + key;
        var cmp = Ext.getCmp(sk);
        if (cmp)
            cmp.setValue('');
    }
}

search = function () {
    var baseParam = createSearchParam();
    var store = grid.getStore();
    store.baseParams = baseParam;
    store.load({
        params: {
            start: 0,
            limit: pageSize
        }
    });
}

/**
 * 生成查询条件
 */
function createSearchParam() {
    var prefix = 'search_';
    var params = searchParams;
    for (var key in params) {
        var value = Ext.getCmp(prefix + key).getValue();
        if (value && typeof(value) == 'string')
            value = value.trim();
        params[key] = value;
    }
    return params;
}

var ds = new Ext.data.JsonStore({
    url: 'page',
    id: 'id',
    root: 'records',
    totalProperty: 'rowCount',
    fields: ['id', 'key', 'display', 'value', 'state']
});
var pageConfig = {
    'pageSize': pageSize,
    'ds': ds,
    'record_start': 0
};

var sm = new Ext.grid.CheckboxSelectionModel({});

var cm = new Ext.grid.ColumnModel([sm, sw.grid.createRowNumberer(pageConfig), {
    header: '编号',
    dataIndex: 'id'
}, {
    header: '关键字',
    dataIndex: 'key'
}, {
    header: '描述',
    dataIndex: 'display'
}, {
    header: '值',
    dataIndex: 'value'
}, {
    header: '状态',
    dataIndex: 'state',
    renderer: function (value) {
        if (value == "0") {
            return '有效';
        } else {
            return '无效';
        }
    }
}, {
    header: '操作',
    dataIndex: 'id',
    renderer: function (value, metadata, record) {
        var btn = '';
        btn += '<button onclick="deleteDictionary(\''
            + record.data.id + '\')">删除</button>';
        btn += '<button onclick="editDictionary(\''
            + record.data.id + '\')">编辑</button>';
        return btn;
    }
}]);

var pageConfig = {
    'pageSize': pageSize,
    'ds': ds,
    'record_start': 0
};

var buttons = [sw.menu.createBtn('查询', 'bsearch', search), '-',
    sw.menu.createBtn('清空条件', 'bapplication_delete', clearSearch), '-',
    sw.menu.createBtn('新增', 'badd', addDictionary)];
var pageBar = sw.grid.createPagebar(pageConfig, buttons);

var topBar = [{
    xtype: 'panel',
    id: 'topBarId',
    border: false,
    width: width,
    items: [{
        xtype: 'toolbar',
        items: [{
            xtype: 'label',
            html: '&nbsp;字典key：'
        }, {
            id: 'search_key',
            xtype: 'textfield',
            editable: false,
            width: 200,
            anchor: '90%'
        }]
    }, pageBar]
}];

var grid = new Ext.grid.GridPanel({
    id: "dictionary",
    layout: "fit",
    autoScroll: true,
    stripeRows: true,
    loadMask: true,
    ds: ds,
    cm: cm,
    sm: sm,
    autoHeight: true,
    width: width,
    viewConfig: {
        forceFit: true
    },
    tbar: topBar
});

// grid.render("sunwei");
// 进入页面即加载
grid.getStore().load({
    params: {
        start: 0,
        limit: pageSize
    }
});

/** ********************业务操作函数**************************** */
//新增
function addDictionary() {
    var fields = [{
        id: 'key',
        fieldLabel: 'key',
        name: 'key',
        allowBlank: false,
        maxLength: 255,
        anchor: '95%'
    }, {
        id: 'display',
        fieldLabel: '描述',
        name: 'display',
        allowBlank: false,
        maxLength: 64,
        anchor: '95%'
    }, {
        id: 'value',
        fieldLabel: '值',
        name: 'value',
        anchor: '95%'
    }, {
        xtype: 'panel',
        fieldLabel: '状态',
        // isFormField:true,
        baseCls: 'x-plain',
        layout: 'column',
        items: [{
            id: 'state_0',
            xtype: 'radio',
            boxLabel: '启用　',
            name: 'state',
            inputValue: '0'
        }, {
            id: 'state_1',
            xtype: 'radio',
            boxLabel: '禁用　',
            name: 'state',
            inputValue: '1'
        }]
    }];

    var form = new Ext.form.FormPanel({
        id: "dictionaryForm",
        baseCls: 'x-plain',
        labelWidth: 100,
        labelAlign: 'right',
        labelPad: 10,
        fileUpload: false,
        defaultType: 'textfield',
        items: fields,
        buttonAlign: 'center',
        buttons: [{
            text: '保存',
            handler: function () {
                sw.ajax.submit("add", "dictionaryForm", function (result) {
                    Ext.getCmp("dictionaryWin").close();
                    grid.store.reload();
                    sw.Msg.info(result.msg);
                });
            }
        }, {
            text: '关闭',
            handler: function () {
                Ext.getCmp("dictionaryWin").close();
            }
        }]
    });
    var title = '新建字典';
    var formWin = sw.util.openDialog("dictionaryWin", form, null, 300, 200,
        title);
    formWin.show();
}

//删除

function deleteDictionary(id) {
    sw.Msg.confirm("温馨提示", "确认删除吗？", function (btn, text) {
        if ('yes' != btn) {
            return;
        }
        sw.ajax.request('delete', {'id': id}, function (result) {
            sw.Msg.info(result.msg);
            grid.getStore().load({params: {start: 0, limit: pageSize}});
        });
    })
}

//编辑

function editDictionary(id) {
    var fields = [{
        id: 'key',
        fieldLabel: 'key',
        name: 'key',
        allowBlank: false,
        maxLength: 255,
        anchor: '95%'
    }, {
        id: 'value',
        fieldLabel: '值',
        name: 'value',
        anchor: '95%'
    }, {
        id: 'id',
        name: 'id',
        hidden: true
    }
    ];

    var form = new Ext.form.FormPanel({
        id: "dictionaryForm",
        baseCls: 'x-plain',
        labelWidth: 100,
        labelAlign: 'right',
        labelPad: 10,
        fileUpload: false,
        defaultType: 'textfield',
        items: fields,
        buttonAlign: 'center',
        buttons: [{
            text: '保存',
            handler: function () {
                sw.ajax.submit("update", "dictionaryForm", function (result) {
                    Ext.getCmp("dictionaryWin").close();
                    grid.store.reload();
                    sw.Msg.info(result.msg);
                });
            }
        }, {
            text: '关闭',
            handler: function () {
                Ext.getCmp("dictionaryWin").close();
            }
        }]
    });
    var title = '更新字典';
    var formWin = sw.util.openDialog("dictionaryWin", form, null, 300, 200,
        title);
    sw.ajax.request("getDictionayById", {'id': id}, function (result) {
        sw.form.setValue("dictionaryForm", result);
        formWin.show();
    }, true);


}

