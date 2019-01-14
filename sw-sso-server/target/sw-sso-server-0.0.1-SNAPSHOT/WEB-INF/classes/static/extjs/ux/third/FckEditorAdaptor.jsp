<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<%
	String ctxPath = request.getContextPath();
	pageContext.setAttribute("ctxPath",ctxPath);
%>

ExtFckEditor = function(cfg){
	this.fckConfig = {
		width : '100%',
		height : '100%',
		toolbarSet : 'Common-light',
		basePath : '${ctxPath}/pub/lib/fckeditor/'
	}	
	ExtFckEditor.superclass.constructor.call(this,Ext.apply(this,cfg));
}
Ext.extend(ExtFckEditor, Ext.form.TextArea,{
	initComponent: function(){
		this.on('afterrender',this.buildFck,this);
		this.on('fckInstance',this.initFckInstance,this,{buffer:500})
		ExtFckEditor.superclass.initComponent.call(this);
	},
	buildFck : function(){
		var instanceName=this.el.id,
		width = this.fckConfig.width,
		height = this.fckConfig.height,
		toolbarSet = this.fckConfig.toolbarSet
		this.fckobj = new FCKeditor(instanceName, width, height, toolbarSet);
		this.fckobj.BasePath = this.fckConfig.basePath; 
	 	this.fckobj.ReplaceTextarea(); 
	 	this.fireEvent('fckInstance');
	},
	getValue : function(){
		if(this.fckInstance){
			var htmlValue = this.fckInstance.GetXHTML(true);
			/*htmlValue = Ext.util.Format.stripTags(htmlValue);
			if(htmlValue.replace(/&nbsp;/ig,'')==""){
				Ext.Msg.show({
					title : '提示',
					msg : '内容不能为空！',
					icon : Ext.Msg.ERROR,
					buttons : Ext.Msg.OK,
					scope:this,
					fn : function(){
						this.focus();
						return false;
					}
				});
			}*/
			return htmlValue;
		}
		return ExtFckEditor.superclass.getValue.call(this);
	},
	setValue : function(htmlValue){
		if(this.fckInstance){			
			this.fckInstance.SetHTML(htmlValue);
		}
	},
	reset : function(){
		this.setValue('');
	},
	focus : function(){
		this.fckInstance.Focus();
	},
	initFckInstance : function(){
		this.fckInstance = FCKeditorAPI.GetInstance(this.el.id);
	}	
});
Ext.reg('fckeditor',ExtFckEditor);