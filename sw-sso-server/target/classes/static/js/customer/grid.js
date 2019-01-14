sw.grid = {};

/**
 * 从sm中取得唯一的记录
 * @param {Object} sm
 */
sw.grid.getSmRecord = function (sm) {
    var selModel = sm;
    var records = selModel.getSelections();
    if (records.length < 1) {
        sw.Msg.warn('请选择要操作的行');
        return;
    }
    else if (records.length > 1) {
        sw.Msg.warn('一次只能操作一行');
        return;
    }
    return record = records[0];
}
/**
 * 从sm中取得所有记录
 * @param {Object} sm
 */
sw.grid.getSmRecords = function (sm) {
    var selModel = sm;
    var records = selModel.getSelections();
    if (records.length < 1) {
        sw.Msg.warn('请至少选择一行');
        return;
    }

    return records;
}

/**
 * 生成支持分页的行号
 * 与sw.grid.createPagebar配合使用
 * @param {} pageConfig
 * @return {}
 */
sw.grid.createRowNumberer = function (pageConfig) {
    return new Ext.grid.RowNumberer({
        header: '序号',
        width: 35,
        dataIndex: 'id',
        renderer: function (value, metadata, record, rowIndex) {
            return pageConfig.record_start + 1 + rowIndex;
        }
    });
}
/**
 * 不分页的grid编号
 * @param {} pageConfig
 * @return {}
 */
sw.grid.createRowNumbererNoPage = function () {
    return new Ext.grid.RowNumberer({
        header: '序号',
        width: 35,
        dataIndex: 'id',
        renderer: function (value, metadata, record, rowIndex) {
            return rowIndex + 1;
        }
    });
}

/**
 * 创建普通分页工具条
 *
 * @param {}
 *            config
 * @return {}
 */
/*sw.grid.createPagebar = function(config,subItems){
	if(!subItems) subItems = [];
	return new Ext.PagingToolbar({
		pageSize: config.pageSize,
		store: config.ds,
		afterPageText: '页/共<b>{0}</b>页',
	    beforePageText: '第',
	    displayInfo: true,
	    displayMsg: '第<b>{0}</b>-<b>{1}</b>条/共<b>{2}</b>条',
	    emptyMsg: '<b>没有数据</b>',
	    firstText: '首页',
	    prevText: '上一页',
	    nextText: '下一页',
	    lastText: '尾页',
	    refreshText: '刷新',
	    autoWidth: true,
	    doLoad : function(start){
			config.record_start = start;
			var o = {}, pn = this.paramNames;
			o[pn.start] = start;
			o[pn.limit] = this.pageSize;
			this.store.load({params:o});
		},
		items: subItems
	});
}*/


/**
 * 创建combox分页工具条
 *
 * @param {}
 *            config
 * @return {}
 */
sw.grid.createPagebar = function (config, subItems) {
    if (!subItems) {
        subItems = [];
    }
    var pageRange = [];
    var showPage = 15;
    var comBoxId = Ext.id();

    function setPageRange(showPage, activePage, totalPage) {
        if (!activePage) {
            activePage = 1;
        }

        if (!totalPage) {
            totalPage = 1;
        }

        var rangeStart = activePage + 1;
        var rangeLimit;
        var pageRange = [];

        if (showPage > totalPage - activePage) {
            rangeLimit = totalPage;
        }
        else {
            rangeLimit = showPage + activePage;
        }

        for (var i = rangeStart; i <= rangeLimit; i++) {
            pageRange.push(new Array(i, i));
        }

        return pageRange;
    }

    return new Ext.PagingToolbar({
        pageSize: config.pageSize,
        store: config.ds,
        afterPageText: '页/共<b>{0}</b>页',
        beforePageText: '第',
        displayInfo: true,
        displayMsg: '第<b>{0}</b>-<b>{1}</b>条/共<b>{2}</b>条',
        emptyMsg: '<b>没有数据</b>',
        firstText: '首页',
        prevText: '上一页',
        nextText: '下一页',
        lastText: '尾页',
        // refreshText: '刷新',
        autoWidth: true,
        items: subItems,
        onFirstLayout: function () {//增加这个配置
            if (this.dsLoaded) {
                this.onLoad.apply(this, this.dsLoaded);
            }
            if (this.rendered && this.refresh) {
                this.refresh.hide();
            }
        }
    });
}

/**
 * 执行排序操作
 * @param {} dd
 * @param {} e
 * @param {} data
 * @param {} tree
 */
sw.grid.doSort = function (dd, e, data, sortUrl, sortOrder, tree) {
    var grid = data.grid;
    var ds = grid.getStore();
    var sm = grid.getSelectionModel();
    var rows = sm.getSelections();//取得拖动的行

    var cindex = dd.getDragData(e).rowIndex;
    var dropData = dd.getDragData(e).selections[0].data;//放置位置的数据

    if (cindex == undefined || cindex < 0) {
        e.cancel = true;
        return;
    }
    for (i = 0; i < rows.length; i++) {
        rowData = rows[i];
        if (rowData.data.id == dropData.id) return;//如果源和目标都是自己，则结束
        if (!this.copy) {
            ds.remove(rowData); // remove in datasource.  
            ds.insert(cindex, rowData); //insert record .  
        }
    }
    //提交完整的新顺序
    var ids = '';
    for (var i = 0; i < ds.getCount(); i++) {
        var record = ds.getAt(i);
        ids += record.data.id;
        if (i < ds.getCount() - 1) ids += ',';
    }
    //alert(ids)
    var dropNode = null;
    if (tree) dropNode = tree.getNodeById(dropData.id);
    sw.ajax.request(sortUrl, {id: ids, sortOrder: sortOrder}, function (result) {
        //sw.Msg.info(result.msg,function(){
        if (null != dropNode) sw.tree.refreshNode(dropNode.parentNode);
        //grid.store.reload();
        //});
    });
}
/**
 * 排序
 */
sw.grid.sort = function (grid, ddGroupName, sortUrl, sortOrder) {
    if (!sortOrder) sortOrder = 'asc';
    var ds = grid.store;
    var ddrow = new Ext.dd.DropTarget(grid.getView().mainBody, {
        ddGroup: ddGroupName,
        copy: false,
        notifyDrop: function (dd, e, data) {
            sw.grid.doSort(dd, e, data, sortUrl, sortOrder);
        }
    });
}
/**
 * 双击打开修改
 * @param {} grid
 * @param {} editFun
 */
sw.grid.dbl2Edit = function (grid, editFun) {
    //双击打开修改
    grid.on('rowdblclick', function (grid, rowIndex, e) {
        //var record = grid.getStore().getAt(rowIndex);
        //alert(record.id);
        editFun();
    });
}

/**
 * 创建显示名列
 * @return {}
 */
sw.grid.createDisplayNameCol = function (title, width) {
    if (!title) title = "名称";
    if (!width) width = 100;
    return {
        header: title,
        dataIndex: "displayName",
        fixed: false,
        width: width,
        renderer: function (value, metadata, record) {
            return '<span title="' + value + '">' + value + '</span>';
        },
        sortable: true
    }
}
/**
 * 创建图标列
 * @return {}
 */
sw.grid.createIconCol = function (title, isPreview) {
    if (!title) title = "图标";
    return {
        header: title,
        dataIndex: "iconCls",
        width: 40,
        fixed: true,
        renderer: function (value, metadata, record) {
            var rtn = value;
            if (isPreview) {
                var url = '/site/page/default/detail.do?id=' + record.data.id;
                rtn = sw.template.iconDispLinkTpl(value, url);
            } else {
                rtn = sw.template.iconDispTpl(value);
            }
            return rtn;
        }
    }
}
/**
 * 创建系统状态列
 * @return {}
 */
sw.grid.createStatusCol = function (statusDs) {
    return {
        header: "系统状态",
        dataIndex: "status",
        fixed: true,
        width: 70,
        sortable: true,
        renderer: function (value) {
            //if(!value) return value;
            return sw.data.transform(value, statusDs);
        }
    }
}
/**
 * 创建业务状态列
 * @return {}
 */
sw.grid.createStateCol = function (stateDs) {
    return {
        header: "状态",
        dataIndex: "state",
        fixed: true,
        width: 50,
        sortable: true,
        renderer: function (value) {
            return sw.data.transform(value, stateDs);
        }
    }
}
/**
 * 创建备注列
 * @return {}
 */
sw.grid.createRemarkCol = function (title) {
    if (!title) title = "备注";
    return {
        header: title,
        dataIndex: 'remark',
        id: 'remark',
        width: 100
    }
}
/**
 * 创建排序号列
 * @return {}
 */
sw.grid.createSortIdxCol = function () {
    return {
        header: '排序号',
        dataIndex: 'sortIdx',
        width: 110,
        fixed: true
    }
}
/**
 * 创建（创建日期）列
 * @return {}
 */
sw.grid.createCreateTimeCol = function () {
    return {
        header: '创建日期',
        dataIndex: "createTime",
        fixed: true,
        width: 140,
        sortable: true,
        renderer: function (value) {
            return sw.util.formatDateTime(value);
        }
    }
}
/**
 * 创建（修改日期）列
 * @return {}
 */
sw.grid.createModifyTimeCol = function () {
    return {
        header: '最后修改日期',
        dataIndex: "modifyTime",
        fixed: true,
        width: 140,
        sortable: true,
        renderer: function (value) {
            return sw.util.formatDateTime(value);
        }
    }
}
/**
 * 创建可见性列
 * @return {}
 */
sw.grid.createVisibility = function () {
    return {
        header: '可见性',
        dataIndex: 'everyOne',
        width: 60,
        fixed: true,
        renderer: function (value) {
            return sw.data.transform(value, visibilityDs);
        }
    }
}
/**
 * 创建日期列
 * @param {} title
 * @param {} dataIndex
 * @return {}
 */
sw.grid.createDateCol = function (title, dataIndex) {
    return {
        header: title,
        dataIndex: dataIndex,
        fixed: true,
        width: 140,
        sortable: true,
        renderer: function (value) {
            return sw.util.formatDate(value);
        }
    }
}
/**
 * 创建占用空间大小列
 * @return {}
 */
sw.grid.createSpaceSize = function (title, dataIndex) {
    if (!title) title = '大小';
    if (!dataIndex) dataIndex = 'size';

    return {
        header: title,
        dataIndex: dataIndex,
        width: 100,
        renderer: function (value) {
            if (value < 1024 * 1024) {//MB以下
                return Math.ceil(value * 100 / 1024) / 100 + '(KB)';
            } else if (value < 1024 * 1024 * 1024) {//GB以下
                return Math.ceil(value * 100 / 1024 / 1024) / 100 + '(MB)';
            } else {//GB以上
                return Math.ceil(value * 100 / 1024 / 1024 / 1024) / 100 + '(GB)';
            }
        }
    }
}
/**
 * 使grid可以被选择，以复制文本
 */
sw.grid.enableTextSelection = function (grid) {
    //enable text selection in IE
    if (Ext.isIE) {
        grid.store.on("load", function () {
            var elems = Ext.DomQuery.select("div[unselectable=on]", grid.dom);
            for (var i = 0, len = elems.length; i < len; i++) {
                elems[i].unselectable = "off";
            }
        });
    }
    else { //any other browser, prmiary Firefox
        grid.store.on("load", function () {
            var elms_h = Ext.DomQuery.select("div[class*=x-grid3-hd-inner]{overflow=hidden}", grid.dom)

            var elms_1 = Ext.DomQuery.select("div[class*=x-grid3-cell-inner]{overflow=hidden}", grid.dom)
            var elms_2 = Ext.DomQuery.select("*{-moz-user-select=none}", grid.dom)
            for (i = 0; i < elms_h.length; i++) {
                elms_h[i].style.overflow = "hidden";
                /* visible */
            }
            for (i = 0; i < elms_1.length; i++) {
                elms_1[i].style.overflow = "hidden";
            }
            for (i = 0; i < elms_2.length; i++) {
                elms_2[i].style["MozUserSelect"] = "text";
            }
        });
    }
}