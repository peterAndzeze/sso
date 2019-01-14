var pageSize = 20;
var width = parent.width - 220;
var height = parent.height - 80;
// 查询条件
var searchParams = {
    createTime: null
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
    if (params.createTime) {
        params.createTime = params.createTime.format("Y-m-d");
    }
    return params;
}

var ds = new Ext.data.JsonStore({
    url: 'page',
    id: 'id',
    root: 'records',
    totalProperty: 'rowCount',
    fields: ['id', 'cfType', 'similarityType', 'evaluatorType', 'precision', 'score', 'recall', 'createTime']
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
    header: '协同类型',
    dataIndex: 'cfType'
}, {
    header: '相似度类型',
    dataIndex: 'similarityType'
}, {
    header: '评分类型',
    dataIndex: 'evaluatorType'
}, {
    header: '查准率',
    dataIndex: 'precision'
}, {
    header: '查全率',
    dataIndex: 'recall'
}, {
    header: '评分',
    dataIndex: 'score'
}, {
    header: '计算时间',
    dataIndex: 'createTime'
}]);

var pageConfig = {
    'pageSize': pageSize,
    'ds': ds,
    'record_start': 0
};

var buttons = [sw.menu.createBtn('查询', 'bsearch', search), '-',
    sw.menu.createBtn('清空条件', 'bapplication_delete', clearSearch)];
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
            html: '&nbsp;计算时间：'
        }, {
            id: 'search_createTime',
            xtype: 'datefield',
            editable: false,
            format: "Y-m-d",
            width: 200,
            anchor: '90%'
        }]
    }, pageBar]
}];

var grid = new Ext.grid.GridPanel({
    id: "evaluateValue",
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


