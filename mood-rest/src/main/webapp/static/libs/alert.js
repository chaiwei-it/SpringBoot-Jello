define("static/libs/alert",["require","exports","module","bootstrap","components/jquery/jquery"],function(require,exports,module){require("bootstrap");{var modalTplFn=function(obj){{var __t,__p="";Array.prototype.join}with(obj||{})__p+='<div class="modal fade">\n    <div class="modal-table">\n        <div class="modal-table-cell">\n            <div class="modal-dialog modal-'+(null==(__t=errorLevel)?"":__t)+'">\n                <div class="modal-content">\n                    <div class="modal-header">\n                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\n                        <h4 class="modal-title">'+(null==(__t=title)?"":__t)+'</h4>\n                    </div>\n\n                    <div class="modal-body">\n                        <p>'+(null==(__t=content)?"":__t)+'</p>\n                    </div>\n                    <div class="modal-footer">\n                        <button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>';return __p},$=require("components/jquery/jquery");module.exports=function(t,n,o){var a=$(modalTplFn({title:o||"提示信息",content:t,errorLevel:n||"info"}));a.appendTo("body").modal({backdrop:"static"}).on("hide.bs.modal",function(){a.remove()})}}});