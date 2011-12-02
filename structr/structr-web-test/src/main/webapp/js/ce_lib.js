function hideProperties(button, entity, view, element) {
//    console.log('hideProperties');
//    console.log(element);
    element.children('.sep').remove();
    element.children('.props').remove();
    enable(button, function() {
        showProperties(button, entity, view, element);
    });
}

function showProperties(button, entity, view, element) {
    if (isDisabled(button)) return;
    disable(button, function() {
        hideProperties(button, entity, view, element);
    });
    console.log(element);
    $.ajax({
        url: rootUrl + entity.id + (view ? '/' + view : ''),
        async: false,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        headers: headers,
        success: function(data) {
            element.append('<div class="sep"></div>');
            element.append('<table class="props"></table>');
            var keys = Object.keys(data.result);
            $(keys).each(function(i, key) {
                $('.props', element).append('<tr><td class="key">' + formatKey(key) + '</td><td class="value">' + formatValue(key, data.result[key]) + '</td></tr>');
            });
        
            $('.props tr td.value input', element).each(function(i,v) {
          
                var input = $(v);
                var oldVal = input.val();
		
		console.log(oldVal);
          
                input.on('focus', function() {
                    input.addClass('active');
                    input.parent().append('<img class="button icon cancel" src="icon/cross.png">');
                    input.parent().append('<img class="button icon save" src="icon/tick.png">');
            
//                    console.log($('.save', input.parent()));
                    $('.cancel', input.parent()).on('click', function() {
                        input.val(oldVal);
                        input.removeClass('active');
                    });
                                          
                    $('.save', input.parent()).on('click', function() {
              
                        var key = input.attr('name');
                        var value = input.val();
                        var data = '{ "' + key + '" : "' + value + '" }';
//                        console.log('PUT url: ' + rootUrl + entity.id);
//                        console.log(data);
              
                        $.ajax({
                            type: 'PUT',
                            url: rootUrl + entity.id,
                            data: data,
                            dataType: 'json',
                            contentType: "application/json",
                            headers: headers,
                            success: function() {
                                input.parent().children('.icon').each(function(i, img) {
                                    $(img).remove();
                                });
                                input.removeClass('active');
//                                console.log(element);//.children('.' + key));
                                element.children('.' + key).text(value);
                                //var tick = $('<img class="icon/tick" src="tick.png">');
                                //tick.insertAfter(input);
//                                console.log('value saved');
                                //$('.tick', input.parent()).fadeOut('slow', function() { console.log('fade out complete');});
                                //$('.tick', $(v).parent()).fadeOut();
                                //$('.tick', $(v).parent()).remove();
                                input.data('changed', false);
                            }
                        });
                    });
                });
          
                input.on('change', function() {
                    input.data('changed', true);
//                    console.log('changed');
                });
                   
                input.on('focusout', function() {
            
                    if (input.data('changed') && confirm('Save changes?')) {
              
                        var key = input.attr('name');
                        var value = input.val();
                        var data = '{ "' + key + '" : "' + value + '" }';
//                        console.log('PUT url: ' + rootUrl + entity.id);
//                        console.log(data);
              
                        $.ajax({
                            type: 'PUT',
                            url: rootUrl + entity.id,
                            data: data,
                            dataType: 'json',
                            contentType: "application/json",
                            headers: headers,
                            success: function() {
                                input.parent().children('.icon').each(function(i, img) {
                                    $(img).remove();
                                });
                                input.removeClass('active');
//                                console.log(element);//.children('.' + key));
                                element.children('.' + key).text(value);
                                //var tick = $('<img class="icon/tick" src="tick.png">');
                                //tick.insertAfter(input);
//                                console.log('value saved');
                                //$('.tick', input.parent()).fadeOut('slow', function() { console.log('fade out complete');});
                                //$('.tick', $(v).parent()).fadeOut();
                                //$('.tick', $(v).parent()).remove();
                                input.data('changed', false);
                            }
                        });
                    }
                    input.removeClass('active');
                    input.parent().children('.icon').each(function(i, img) {
                        $(img).remove();
                    });
//                    console.log('onFocusout: value: ' + input.attr('value'));
                });
          
          

            });
        //enable(button);
        }
    });
}

function formatValue(key, obj) {

    if (obj == null) {
        return '';
    } else if (obj.constructor === Object) {

        return '<input name="' + key + '" type="text" value="' + JSON.stringify(obj) + '">';

    } else if (obj.constructor === Array) {
        var out = '';
        $(obj).each(function(i,v) {
            console.log(v);
            out += JSON.stringify(v);
        });

        return '<textarea name="' + key + '">' + out + '</textarea>';

    } else {
        return '<input name="' + key + '" type="text" value="' + obj + '">';

    }
    
    //return '<input name="' + key + '" type="text" value="' + formatValue(data.result[key]) + '">';
}

function formatKey(text) {
    var result = '';
    for (var i=0; i<text.length; i++) {
        var c = text.charAt(i);
        if (c == c.toUpperCase()) {
            result += ' ' + c;
        } else {
            result += (i==0 ? c.toUpperCase() : c);
        }
    }
    return result;
}

function deleteAll(button, type, callback) {
    var types = plural(type);
    var element = $('#' + types);
    if (isDisabled(button)) return;
    var con = confirm('Delete all ' + types + '?');
    if (!con) return;
    $.ajax({
        url: rootUrl + type.toLowerCase(),
        type: "DELETE",
        headers: headers,
        success: function(data) {
            $(element).children("." + type).each(function(i, child) {
                $(child).remove();
            });
            enable(button);
            if (callback) callback();
        }
    });
}

function deleteNode(button, entity, callback) {
    if (isDisabled(button)) return;
    var con = confirm('Delete ' + entity.name + ' [' + entity.id + ']?');
    if (!con) return;
    disable(button);
    var elementSelector = '.' + entity.id + '_';
    $.ajax({
        url: rootUrl + entity.type.toLowerCase() + '/' + entity.id,
        type: "DELETE",
        headers: headers,
        success: function(data) {
            $(elementSelector).hide('blind', {
                direction: "vertical"
            }, 200);
            $(elementSelector).remove();
            refreshIframes();
            enable(button);
            if (callback) callback();
        }
    });
}

function addNode(button, type, parentId, elementId) {
    if (isDisabled(button)) return;
    disable(button);
    var pos = $('.' + parentId + '_ .' + elementId + '_ > div.nested').length;
    //console.log('addNode(' + type + ', ' + resourceId + ', ' + elementId + ', ' + pos + ')');
    var url = rootUrl + type;
    var resp = $.ajax({
        url: url,
        //async: false,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        headers: headers,
        data: '{ "type" : "' + type + '", "name" : "content_' + Math.floor(Math.random() * (9999 - 1)) + '", "elementId" : "' + elementId + '" }',
        success: function(data) {
            var nodeUrl = resp.getResponseHeader('Location');
            //console.log(nodeUrl);
            setPosition(parentId, nodeUrl, pos);
            refresh(parentId, elementId);
            enable(button);
        }
    });
}

function isDisabled(button) {
    return $(button).data('disabled');
}

function disable(button, callback) {
    var b = $(button);
    b.data('disabled', true);
    b.addClass('disabled');
    if (callback) {
        b.off('click');
        b.on('click', callback);
        b.data('disabled', false);
        //enable(button, callback);
    }
}

function enable(button, func) {
    var b = $(button);
    b.data('disabled', false);
    b.removeClass('disabled');
    if (func) {
        b.off('click');
        b.on('click', func);
    }
}

function setPosition(parentId, nodeUrl, pos) {
    var toPut = '{ "' + parentId + '" : ' + pos + ' }';
    //console.log(toPut);
    $.ajax({
        url: nodeUrl + '/in',
        type: 'PUT',
        async: false,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        headers: headers,
        data: toPut,
        success: function(data) {
        //appendElement(parentId, elementId, data);
        }
    });
}

function refresh(parentId, id) {
    $('.' + parentId + '_ ' + id + '_ > div.nested').remove();
    showElementsOfResource(parentId, id);
}



var keyEventBlocked = true;
var keyEventTimeout;

function editContent(button, resourceId, contentId) {
    if (isDisabled(button)) return;
    var div = $('.' + resourceId + '_ .' + contentId + '_');
    div.append('<div class="editor"></div>');
    var contentBox = $('.editor', div);
    disable(button, function() {
        contentBox.remove();
        enable(button, function() {
            editContent(button, resourceId, contentId);
        });
    });
    var codeMirror;
    var url = rootUrl + 'content' + '/' + contentId;
    $.ajax({
        url: url,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        headers: headers,
        success: function(data) {
            codeMirror = CodeMirror(contentBox.get(0), {
                value: data.result.content,
                mode:  "htmlmixed",
                lineNumbers: true,
                onKeyEvent: function() {
                    //console.log(keyEventBlocked);
                    if (keyEventBlocked) {
                        clearTimeout(keyEventTimeout);
                        keyEventTimeout = setTimeout(function() {
                            var data = '{ "content" : ' + $.quoteString(codeMirror.getValue()) + ' }';
                            //console.log(data);
                            $.ajax({
                                url: url,
                                //async: false,
                                type: 'PUT',
                                dataType: 'json',
                                contentType: 'application/json; charset=utf-8',
                                headers: headers,
                                data: data,
                                success: function(data) {
                                    refreshIframes();
                                    keyEventBlocked = true;
                                //enable(button);
                                }
                            });
                        }, 500);
                        return;
                    }
                }
            });
        }
    });
}

function refreshIframes() {
    $('.preview_box iframe').each(function() {
        this.contentDocument.location.reload(true);
    });
}

function appendElement(parentId, elementId, nested) {
    var type = nested.type.toLowerCase();
    var id = nested.id;
    var name = nested.name;
    var selector = '.' + parentId + '_ ' + (elementId ? '.' + elementId + '_' : '');
    var element = $(selector);
    element.append('<div class="nested ' + type + ' ' + parentId + '_ ' + id + '_"'
        + '>'
        + type + ' <b>' + name + '</b> [' + id + '] (parent: ' + parentId + ')'
        //+ '<b>' + name + '</b>'
        + '</div>');
    var appendedSelector = '.' + parentId + '_ .' + id + '_';
    var div = $(appendedSelector);
    div.append('<img title="Delete" alt="Delete" class="delete_icon button" src="icon/delete.png">');
    $('.delete_icon', div).on('click', function() {
        deleteNode(this, nested, appendedSelector)
    });
    if (type == 'content') {
        div.append('<img title="Edit" alt="Edit" class="edit_icon button" src="icon/pencil.png">');
        $('.edit_icon', div).on('click', function() {
            editContent(this, parentId, id)
        });
    //div.append('<img title="Close" alt="Close" class="close_icon" src="icon/cross.png">');
    //$('.close_icon', div).hide();
    } else {
        div.append('<img title="Add" alt="Add" class="add_icon button" src="icon/add.png">');
        $('.add_icon', div).on('click', function() {
            addNode(this, 'content', parentId, id)
        });
    }
    //div.append('<img class="sort_icon" src="icon/arrow_up_down.png">');
    div.sortable({
        axis: 'y',
        appendTo: '.' + parentId + '_',
        delay: 100,
        containment: 'parent',
        cursor: 'crosshair',
        //handle: '.sort_icon',
        stop: function() {
            $('div.nested', this).each(function(i,v) {
                var nodeId = lastPart(v.id);
                var url = rootUrl + nodeId + '/' + 'in';
                //console.log(url);
                $.ajax({
                    url: url,
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    async: false,
                    headers: headers,
                    success: function(data) {
                        if (!data || data.length == 0 || !data.result) return;
                        var rel = data.result;
                        var pos = rel[parentId];
                        var nodeUrl = rootUrl + nodeId;
                        setPosition(parentId, nodeUrl, i)
                    }
                });
                refreshIframes();
            });
        }
    });
}

function lastPart(id, separator) {
    if (!separator) {
        separator = '_';
    }
    if (id) {
        return id.substring(id.lastIndexOf(separator)+1);
    }
    return '';
}
                                            
function sortArray(arrayIn, sortBy) {
    var arrayOut = arrayIn.sort(function(a,b) {
        return sortBy.indexOf(a.id) > sortBy.indexOf(b.id);
    });
    return arrayOut;
}
  
function followIds(resourceId, nodeId) {
    var resId = resourceId.toString();
    if (!nodeId) nodeId = resourceId;
    var url = rootUrl + nodeId + '/' + 'out';
    //console.log(url);
    var ids = [];
    $.ajax({
        url: url,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async: false,
        headers: headers,
        success: function(data) {
            //console.log(data);
            if (!data || data.length == 0 || !data.result) return;
            var out = data.result;
            if ($.isArray(out)) {
                //for (var i=0; i<out.length; i++) {
                $(out).each(function(i, rel) {
                    var pos = rel[resId];
                    if (pos) {
                        //console.log('pos: ' + pos);
                        ids[pos] = rel.endNodeId;
                    //console.log('ids[' + pos + ']: ' + ids[pos]);
                    }
                });
            } else {
          
                if (out[resId]) {
                    //console.log('out[resId]: ' + out[resId]);
                    ids[out[resId]] = out.endNodeId;
                //console.log('ids[' + out[resId] + ']: ' + out.endNodeId);
                }
            }
        }
    });
    //console.log('resourceId: ' + resourceId + ', nodeId: ' + resourceId);
    //console.log(ids);
    return ids;
}
  
function isIn(id, ids) {
    return ($.inArray(id, ids) > -1);
}