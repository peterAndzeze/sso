sw.tree = {};

sw.tree.deep = 8;//规定树的最大深度

/**
 * 取得从node到root的路径
 * @param {Object} node
 * @param {Object} rootId
 */
sw.tree.getTextPath = function (node, rootId) {
    if (rootId == node.id) {
        return node.text;
    } else {
        return sw.tree.getTextPath(node.parentNode, rootId) + ' >> ' + node.text;
    }
};

/**
 * 刷新指定节点
 * @param {Object} node
 */
sw.tree.refreshNode = function (node) {
    if (!node) return;
    //alert('nodeId='+node.id)
    //alert('rootId='+node.getOwnerTree().getRootNode().id)
    if (node.isLeaf() || !node.hasChildNodes()) {//叶子节点
        node.parentNode.attributes.children = false;
        node.parentNode.reload();
    } else {//非叶子节点
        node.attributes.children = false;
        node.reload();
    }
};

/**
 * 用保存节点时，服务端返回的数据更新节点
 * @param {Object} currentNode
 * @param {Object} data
 */
sw.tree.updateNode = function (currentNode, data) {

    var newNode = new Ext.tree.TreeNode({
        id: data.id,
        text: data.displayName,
        leaf: true,
        'attributes.iconCls': data.iconCls
    });
    if (currentNode.id == data.id) {//属修改操作
        //currentNode.parentNode.replaceChild(newNode,currentNode);
        currentNode.setText(data.displayName);
    }
    else {
        currentNode.leaf = false;
        currentNode.appendChild(newNode);
        currentNode.expand();
    }
};

/**
 * 清空复选树的选择
 * @param {} rootNode
 */
sw.tree.clearCheckTree = function (tree, withEvt, isDelay) {
    if (!tree) return;
    tree.expandAll();
    var handler = function () {
        var childNodes = tree.getChecked();
        for (var i = 0; i < childNodes.length; i++) {
            var checkNode = childNodes[i];
            checkNode.getUI().checkbox.checked = false;
            checkNode.attributes.checked = false;
            if (withEvt) tree.fireEvent('checkchange', checkNode, false);
        }
    };
    if (isDelay) {
        window.setTimeout(handler, 500);
    } else {
        handler();
    }
};

/**
 * 选中给定的节点
 * 不触发事件
 * @param {} node
 * @param {} checked
 */
sw.tree.checkNodeLight = function (node, checked) {
    if (!node) return;
    if (node.getUI().checkbox) {
        node.getUI().checkbox.checked = checked;
    }
    node.attributes.checked = checked;
};

/**
 * 选中给定的节点
 * @param {} node
 * @param {} checked
 */
sw.tree.checkNode = function (node, checked) {
    if (!node) return;
    if (node.getUI().checkbox) {
        node.getUI().checkbox.checked = checked;
    }
    node.attributes.checked = checked;
    node.fireEvent('checkchange', node, checked);
};

/**
 * 选中给定结点的子结点
 * @param {} node
 * @param {} checked
 */
sw.tree.checkChildNodes = function (node, checked) {
    node.eachChild(function (subNode) {
        //if(!subNode.attributes['checked']){
        sw.tree.checkNode(subNode, checked);
        //}else{
        //sw.tree.checkNode(subNode,false);
        //}
        if (subNode.hasChildNodes()) {
            //subNode.expandChildNodes(true);//必须展开子节点,不然无法选上
            sw.tree.checkAll(subNode, checked);
        }
    });
};

/**
 * 全选给定节点的所有子节点
 * @param {} tree
 */
sw.tree.checkAll = function (node, checked) {
    if (!node) return;
    //alert(node.text);
    if (!node.isExpanded()) {
        //node.getOwnerTree().expandAll();
        node.on('expand', function () {
            sw.tree.checkChildNodes(node, checked);
            node.un('expand');
        });
        node.expand(true);
    } else {
        sw.tree.checkChildNodes(node, checked);
    }

};

/**
 * 带树的grid排序
 * @param {} grid
 * @param {} tree
 * @param {} ddGroupName
 * @param {} sortUrl
 */
sw.tree.gridTreeSort = function (grid, tree, ddGroupName, sortUrl, sortOrder) {
    if (!sortOrder) sortOrder = 'asc';
    var ds = grid.store;
    var ddrow = new Ext.dd.DropTarget(grid.getView().mainBody, {
        ddGroup: ddGroupName,
        copy: false,
        notifyDrop: function (dd, e, data) {
            sw.grid.doSort(dd, e, data, sortUrl, sortOrder, tree);
        }
    });
};

/**
 * 树型结构排序
 * @param {} tree
 * @param {} sortAttr
 * @param {} dir
 * @return {}
 */
sw.tree.sort = function (tree, sortAttr, dir) {
    return new Ext.tree.TreeSorter(
        tree, {
            //folderSort:true,
            dir: dir,
            caseSensitive: true,
            property: sortAttr
            /*
            ,sortType: function(node) {
                // sort by a custom, typed attribute:
                var attr = node[sortAttr];
                if(!attr) attr = node.attributes[sortAttr];
                return attr;
            }*/
        });
};

/**
 * 按排序号升序排序
 * @param {} tree
 * @return {}
 */
sw.tree.sortBySortIdxAsc = function (tree) {
    return sw.tree.sort(tree, 'sortIdx', 'asc');
};

/**
 * 序列化树节点的勾选的数据
 * @param {} node
 * @param {} checked
 * @param {} container
 */
sw.tree.serialCheckChange = function (node, checked, container) {
    var mValue = ',' + node.id;
    var newValue = container.getValue();

    var addValue = mValue + '#add';
    if (checked) {
        //子节点会重复，要排除重复值
        if (newValue.indexOf(addValue) < 0) {
            newValue += addValue;
        }
    } else {
        if (newValue.indexOf(addValue) >= 0) {//刚如果加过，就直接去掉
            newValue = newValue.replace(addValue, '');
        } else {
            newValue += mValue + '#remove';
        }
    }
    //alert('newValue='+newValue)
    container.setValue(newValue);
};

/**
 * 将勾选的操作数据与原始数据合并
 * @param {} container
 * @param {} oraStr
 */
sw.tree.mergeCheckChange = function (oraContainerId, newContainerId) {
    var oraContainer = Ext.getCmp(oraContainerId);
    var newContainer = Ext.getCmp(newContainerId);

    var oraValue = oraContainer.getValue();
    var newValue = newContainer.getValue();
    //alert('oraValue='+oraValue+' len='+oraValue.length)
    //alert('newValue='+newValue+' len='+newValue.length)
    var oraAry = oraValue.split(',');
    for (var i = 0; i < oraAry.length; i++) {//去空格
        oraAry[i] = oraAry[i].trim();
    }
    var rmAry = new Array();//移除队列
    if (newValue.trim().length > 0) {
        var newAry = newValue.split(',');
        for (var i = 0; i < newAry.length; i++) {//加入增加的
            var item = newAry[i];
            if (item.trim().length == 0) continue;//排除空值
            //alert('item='+item);
            var valPair = item.split('#');
            var val = valPair[0].trim();
            if ('add' == valPair[1]) {
                oraAry.push(val);
            } else {
                rmAry.push(val);
            }
        }
    }
    var rtnAry = new Array();
    for (var i = 0; i < oraAry.length; i++) {//移去减少的
        var item = oraAry[i];
        if (item.trim().length == 0) continue;//排除空值
        var flag = false;
        for (var m = 0; m < rmAry.length; m++) {
            if (item == rmAry[m]) {
                flag = true;
            }
        }
        if (!flag) {//如果该项不在移除队列中，则加入到最终队列中
            rtnAry.push(item);
        }
    }
    return rtnAry;
};