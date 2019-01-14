var pageSize = 10;
var width = parent.width - 220;
var height = parent.height - 80;
// 查询条件
var searchParams = {
	group : null,
	className : null
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
	fields : ['id', 'type', 'cron', 'state', 'group',  'className']
		// 'type', 'cron', 'state', 'group','isRun','className'
	});
var pageConfig = {
	'pageSize' : pageSize,
	'ds' : ds,
	'record_start' : 0
};

var sm = new Ext.grid.CheckboxSelectionModel({});

var cm = new Ext.grid.ColumnModel([sm, sw.grid.createRowNumberer(pageConfig), {
			header : '编号',
			dataIndex : 'type'
		}, {
			header : '类型',
			dataIndex : 'type'
		}, {
			header : '组',
			dataIndex : 'group'
		}, {
			header : '类信息',
			dataIndex : 'className'
		},{
			header:'cron',
			dataIndex:'cron'
		}, {
			header : '数据状态',
			dataIndex : 'state',
			renderer : function(value) {
				if (value == "2") {
					return '运行中';
				} else {
					return '已停止';
				}
			}

		}, {
			header : '操作',
			dataIndex : 'id',
			width:200,
			renderer : function(value, metadata, record) {
				var btn = '';
				btn += '<button onclick="deletequartz(\'' + record.data.id
						+ '\')">删除</button>';
				btn += '<button onclick="editquartz(\'' + record.data.id
						+ '\')">编辑</button>';
				btn += '<button onclick="pausedquartz(\'' + record.data.id
						+ '\')">暂停</button>';	
				btn += '<button onclick="resumequartz(\'' + record.data.id
						+ '\')">恢复</button>';		
						
				return btn;
			}
		}]);

var pageConfig = {
	'pageSize' : pageSize,
	'ds' : ds,
	'record_start' : 0
};

var buttons = [sw.menu.createBtn('查询', 'bsearch', search), '-',
		sw.menu.createBtn('清空条件', 'bapplication_delete', clearSearch), '-',
		sw.menu.createBtn('新增', 'badd', addquartz)];
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
									html : '&nbsp;组信息：'
								}, {
									id : 'search_group',
									xtype : 'textfield',
									editable : false,
									width : 200,
									anchor : '90%'
								}, {
									xtype : 'label',
									html : '&nbsp;类信息：'
								}, {
									id : 'search_className',
									xtype : 'textfield',
									editable : false,
									width : 200,
									anchor : '90%'
								}]
					}, pageBar]
		}];

var grid = new Ext.grid.GridPanel({
			id : "quartz",
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

/** ********************业务操作函数**************************** */
// 新增
function addquartz() {
	var fields = [{
				id : 'type',
				fieldLabel : '类型',
				name : 'type',
				allowBlank : false,
				maxLength : 255,
				anchor : '95%'
			},{
				id : 'group',
				fieldLabel : '组',
				name : 'group',
				allowBlank : false,
				maxLength : 255,
				anchor : '95%'
			}, {
				id : 'className',
				fieldLabel : '类信息',
				name : 'className',
				allowBlank : false,
				maxLength : 255,
				anchor : '95%'
			}, {
				id : 'cron',
				fieldLabel : '表达式',
				name : 'cron',
				anchor : '95%'
			}, {

				xtype : 'panel',
				fieldLabel : '数据状态',
				// isFormField:true,
				baseCls : 'x-plain',
				layout : 'column',
				items : [{
							id : 'state_0',
							xtype : 'radio',
							boxLabel : '运行中　',
							name : 'state',
							inputValue : '2'
						}, {
							id : 'state_1',
							xtype : 'radio',
							boxLabel : '停止　',
							name : 'state',
							inputValue : '1'
						}]

			}, {
				id : 'id',
				name : 'id',
				hidden : true
			}];

	var form = new Ext.form.FormPanel({
				id : "quartzForm",
				baseCls : 'x-plain',
				labelWidth : 100,
				labelAlign : 'right',
				labelPad : 10,
				fileUpload : false,
				defaultType : 'textfield',
				items : fields,
				buttonAlign : 'center',
				buttons : [{
					text : '保存',
					handler : function() {
						sw.ajax.submit("saveOrUpdateQuartz", "quartzForm",
								function(result) {
									Ext.getCmp("quartzWin").close();
									grid.store.reload();
									sw.Msg.info(result.msg);
								});
					}
				}, {
					text : '关闭',
					handler : function() {
						Ext.getCmp("quartzWin").close();
					}
				}]
			});
	var title = '新建字典';
	var formWin = sw.util.openDialog("quartzWin", form, null, 400, 300, title);
	formWin.show();
}

// 删除

function deletequartz(id) {
	sw.Msg.confirm("温馨提示", "确认删除吗？", function(btn, text) {
				if ('yes' != btn) {
					return;
				}
				sw.ajax.request('deleteQuartz', {
							'id' : id
						}, function(result) {
							sw.Msg.info(result.msg);
							grid.getStore().load({
										params : {
											start : 0,
											limit : pageSize
										}
									});
						});
			})
}

// 编辑

function editquartz(id) {
	var fields = [{
				id : 'className',
				fieldLabel : '类信息',
				name : 'className',
				allowBlank : false,
				maxLength : 255,
				anchor : '95%'
			}, {
				id : 'cron',
				fieldLabel : '表达式',
				name : 'cron',
				anchor : '95%'
			}, {
				id : 'id',
				name : 'id',
				hidden : true
			}];

	var form = new Ext.form.FormPanel({
				id : "quartzForm",
				baseCls : 'x-plain',
				labelWidth : 100,
				labelAlign : 'right',
				labelPad : 10,
				fileUpload : false,
				defaultType : 'textfield',
				items : fields,
				buttonAlign : 'center',
				buttons : [{
					text : '保存',
					handler : function() {
						sw.ajax.submit("saveOrUpdateQuartz", "quartzForm",
								function(result) {
									Ext.getCmp("quartzWin").close();
									grid.store.reload();
									sw.Msg.info(result.msg);
								});
					}
				}, {
					text : '关闭',
					handler : function() {
						Ext.getCmp("quartzWin").close();
					}
				}]
			});
	var title = '更新定时任务';
	var formWin = sw.util.openDialog("quartzWin", form, null, 300, 200, title);
	sw.ajax.request("getQuartzInfo", {
				'id' : id
			}, function(result) {
				sw.form.setValue("quartzForm", result);
				var statusId = 'state_' + (result.state==2? 2 : 3);
				Ext.getCmp(statusId).setValue(true);
				formWin.show();
			}, true);
}

function pausedquartz(id){
	sw.ajax.request('paused', {'id' : id}, function(result) {
				sw.Msg.info(result.msg);
				grid.getStore().load({
						params : {
									start : 0,
									limit : pageSize
								}
						});
			});
}

function resumequartz(id ){
	sw.ajax.request('resume', {'id' : id}, function(result) {
				sw.Msg.info(result.msg);
				grid.getStore().load({
						params : {
									start : 0,
									limit : pageSize
								}
						});
			});
}

