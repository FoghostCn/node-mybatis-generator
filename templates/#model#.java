package com.org.model;

import com.org.base.BaseModel;

/**
 * <%=schema.comment%>
 * @table <%=schema.tableName%>
 * @author <%=schema.author%>
 **/
public class <%=schema.modelName%> extends BaseModel {

    private static final long serialVersionUID = 1L;

<% schema.fields.forEach(function(e){ %>
    private <%=e.javaType%> <%=e.property%>; // <%=e.comment%>
<% })%>
<% schema.fields.forEach(function(e){ %>
    <%=e.setter%>

    <%=e.getter%>
<% })%>
}