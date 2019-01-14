var pageSize = 20;
var width = parent.width - 220;
var height = parent.height - 80;
// 查询条件
var searchParams = {
	userId:null 
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
search = function() {
	var baseParam = createSearchParam();
	var store = grid.getStore();
	store.baseParams = baseParam;
	store.load({
				params : {
					start : 0,
					limit : pageSize
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
	url : 'page',
	id : 'id',
	root : 'records',
	totalProperty : 'rowCount',
	fields : ['userId','articleId', 'value']
		// 'type', 'cron', 'state', 'group','isRun','className'
	});
var pageConfig = {
	'pageSize' : pageSize,
	'ds' : ds,
	'record_start' : 0
};

var sm = new Ext.grid.CheckboxSelectionModel({});

var cm = new Ext.grid.ColumnModel([sm, sw.grid.createRowNumberer(pageConfig), 
		{
			header:'用户',
			dataIndex:'userId'
		},{
			header : '文章编号',
			dataIndex : 'articleId'
		}, {
			header : '值',
			dataIndex : 'value'
		}]);

var pageConfig = {
	'pageSize' : pageSize,
	'ds' : ds,
	'record_start' : 0
};

var buttons = [ sw.menu.createBtn('查询', 'bsearch', search), '-',
		sw.menu.createBtn('清空条件', 'bapplication_delete', clearSearch)];
var pageBar = sw.grid.createPagebar(pageConfig, buttons);

var topBar = [{
			xtype : 'panel',
			id : 'topBarId',
			border : false,
			width : width,
			items : [{
						xtype : 'toolbar',
						items : [{
									xtype : 'label',
									html : '&nbsp;用户编号：'
								}, {
									id : 'search_userId',
									xtype : 'textfield',
									editable : false,
									width : 200,
									anchor : '90%'
								}]
					}, pageBar]
		}];

var grid = new Ext.grid.GridPanel({
			id : "recommend",
			layout : "fit",
			autoScroll : true,
			stripeRows : true,
			loadMask : true,
			ds : ds,
			cm : cm,
			sm : sm,
			autoHeight : true,
			width : width,
			viewConfig : {
				forceFit : true
			},
			tbar : topBar
		});

// grid.render("sunwei");
// 进入页面即加载
grid.getStore().load({
			params : {
				start : 0,
				limit : pageSize
			}
		});
/*Ext.getCmp("recommend")..get(refreshStr).child('#refresh').setHandler(    
                         function () {    
                               alert("12231");
                         }    
                    );   */ 
