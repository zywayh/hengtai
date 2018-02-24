/**
  1:页面引用js,并添加 
 	<input type="file" name="file"/>
 	input中的name必须对应接口参数名称
 	
  2:页面添加jquery方法
  	$(function(){
		$("input[type='file']").change(function() {
		    $("").ajaxStart(function() {//上传之前调用
		    }).ajaxComplete(function() {//上传完成调用
		    }); 
		    $.ajaxFileUpload({
		        url: getContextPath() + "/upload/upload",	//服务器路径
		        fileName:"file",							//参数名称
		        dataType: 'text/html', 						//返回值类型，一般设置为json、application/json
		        element:$(this),
		        success: function(data, status){
		            $(".fileImg").attr("src",data);
		        },error: function(data, status, e){
		        	alert("网络错误!!!");
		        }
		    });
		});
	});
 */


//$(function(){
//	$("input[type='file']").change(function() {
//        $(".asdasd").ajaxStart(function() {//上传之前调用
//        }).ajaxComplete(function() {//上传完成调用
//        });
//        $.ajaxFileUpload({
//            url: "/moko/upload/upload",				//服务器路径
//            fileName:"file",						//参数名称
//            type: 'post',							//请求方式
//            dataType: 'text/html', 					//返回值类型，一般设置为json、application/json
//            element:$(this),
//            success: function(data, status){
//                $(".fileImg").attr("src",data);
//            },error: function(data, status, e){
//            	alert("网络错误!!!");
//            }
//        });
//    });
//});

jQuery.extend({
    ajaxFileUpload: function(s) {
        s = jQuery.extend({}, jQuery.ajaxSettings, s);
        var _this = s.element;
        var timestamp = (new Date()).valueOf();
        var id = "id" + timestamp;
        _this.attr("id",id);
		var form = jQuery.createUploadForm(id);
		var io = jQuery.createUploadIframe(id, s.secureuri,s.fileName);
		var frameId = 'jUploadFrame' + id;
		var formId = 'jUploadForm' + id;		
        if ( s.global && ! jQuery.active++ ) {
			jQuery.event.trigger( "ajaxStart" );
		}            
        var requestDone = false;
        // Create the request object
        var xml = {}   
        if ( s.global )
            jQuery.event.trigger("ajaxSend", [xml, s]);
        // Wait for a response to come back
        var uploadCallback = function(isTimeout) {			
			var io = document.getElementById(frameId);
            try  {				
				if(io.contentWindow) {
					xml.responseText = io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;
                	xml.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
				}else if(io.contentDocument) {
					xml.responseText = io.contentDocument.document.body?io.contentDocument.document.body.innerHTML:null;
                	xml.responseXML = io.contentDocument.document.XMLDocument?io.contentDocument.document.XMLDocument:io.contentDocument.document;
				}						
            }catch(e){jQuery.handleError(s, xml, null, e);}
            if ( xml || isTimeout == "timeout") {				
                requestDone = true;
                var status;
                try {
                    status = isTimeout != "timeout" ? "success" : "error";
                    // Make sure that the request was successful or notmodified
                    if ( status != "error" ){
                        // process the data (runs the xml through httpData regardless of callback)
                        var data = jQuery.uploadHttpData( xml, s.dataType );    
                        // If a local callback was specified, fire it and pass it the data
                        if ( s.success )s.success( data, status );
                        // Fire the global callback
                        if( s.global )jQuery.event.trigger( "ajaxSuccess", [xml, s] );
                    } else
                        jQuery.handleError(s, xml, status);
                } catch(e){ status = "error";jQuery.handleError(s, xml, status, e);}
                // The request was completed
                if( s.global )jQuery.event.trigger( "ajaxComplete", [xml, s] );
                // Handle the global AJAX counter
                if ( s.global && ! --jQuery.active )jQuery.event.trigger( "ajaxStop" );
                if ( s.complete )s.complete(xml, status);
                jQuery(io).unbind()
                setTimeout(function(){try{$(io).remove();$(form).remove();} catch(e) {jQuery.handleError(s, xml, null, e);}}, 100)
                xml = null
            }
        }
        if ( s.timeout > 0 ) {
            setTimeout(function(){ if( !requestDone ) uploadCallback( "timeout" ); }, s.timeout);
        }
        try  {
           // var io = $('#' + frameId);
			var form = $('#' + formId);
			$(form).attr('action', s.url);
			$(form).attr('method', 'POST');
			$(form).attr('target', frameId);
            if(form.encoding){
                form.encoding = 'multipart/form-data';				
            }
            else{				
                form.enctype = 'multipart/form-data';
            }			
            $(form).submit();

        } catch(e)  {			
            jQuery.handleError(s, xml, null, e);
        }
        if(window.attachEvent){
            document.getElementById(frameId).attachEvent('onload', uploadCallback);
        } else{
            document.getElementById(frameId).addEventListener('load', uploadCallback, false);
        } 		
        return {abort: function () {}};	
    },
    
    
    createUploadIframe: function(id, uri,name) {
        var frameId = 'jUploadFrame' + id;
        if(window.ActiveXObject) {
            var io = document.createElement('<iframe id="' + frameId + '" name="' + name + '" />');
            if(typeof uri== 'boolean'){
                io.src = 'javascript:false';
            } else if(typeof uri== 'string'){
                io.src = uri;
            }else{
            	io.src = 'javascript:false';
            }
        }
        else {
            var io = document.createElement('iframe');
            io.id = frameId;
            io.name = frameId;
        }
        io.style.position = 'absolute';
        io.style.top = '-1000px';
        io.style.left = '-1000px';
        document.body.appendChild(io);
        return io;			
    },
    
    
    createUploadForm: function(id) {
		//create form	
		var formId = 'jUploadForm' + id;
		var fileId = 'jUploadFile' + id;
		var form = $('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');	
		var oldElement = $('#' + id);
		var newElement = $(oldElement).clone(true);
	//	newElement[0].files=oldElement[0].files;  
		$(oldElement).attr('id', fileId);
		$(oldElement).before(newElement);
		$(oldElement).appendTo(form);
		//set attributes
		$(form).css('position', 'absolute');
		$(form).css('top', '-1200px');
		$(form).css('left', '-1200px');
		$(form).appendTo('body');		
		return form;
    },
    
    
    uploadHttpData: function( r, type ) {
        var data = !type;
        data = type == "xml" || data ? r.responseXML : r.responseText;
        if ( type == "script" )
            jQuery.globalEval( data );
        if ( type == "json" )
            eval( "data = " + data );
        if ( type == "html" )
            jQuery("<div>").html(data).evalScripts();
        return data;
    }
})

