define("components/jquery-validation-1.14.0/additional-methods-common",["require","exports","module"],function(){function t(t){var n,a=new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1),o=new Array("1","0","X","9","8","7","6","5","4","3","2"),d=new Array,u=0,s=t.length,h=t;if(15!=s&&18!=s)return!1;for(i=0;s>i;i++){if(d[i]=h.charAt(i),(d[i]<"0"||d[i]>"9")&&17!=i)return!1;17>i&&(d[i]=d[i]*a[i])}if(18==s){var l=h.substring(6,14);if(0==e(l))return!1;for(i=0;17>i;i++)u+=d[i];if(n=o[u%11],d[17]!=n)return!1}else{var v=h.substring(6,12);if(0==r(v))return!1}return!0}function r(t){if(!/^[0-9]{6}$/.test(t))return!1;var r,e;return r=t.substring(0,4),e=t.substring(4,6),1700>r||r>2500?!1:1>e||e>12?!1:!0}function e(t){if(!/^[0-9]{8}$/.test(t))return!1;var r,e,i;r=t.substring(0,4),e=t.substring(4,6),i=t.substring(6,8);var n=[31,28,31,30,31,30,31,31,30,31,30,31];return 1700>r||r>2500?!1:((r%4==0&&r%100!=0||r%400==0)&&(n[1]=29),1>e||e>12?!1:1>i||i>n[e-1]?!1:!0)}jQuery.validator.addMethod("mobile",function(t,r){var e=t.length,i=/^[1][3578]\d{9}$/;return this.optional(r)||11==e&&i.test(t)},"手机号码格式错误"),jQuery.validator.addMethod("phone",function(t,r){var e=/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;return this.optional(r)||e.test(t)},"电话号码格式错误。电话号码格式 区号-电话号码-分机号"),jQuery.validator.addMethod("zipCode",function(t,r){var e=/^[0-9]{6}$/;return this.optional(r)||e.test(t)},"邮政编码格式错误"),jQuery.validator.addMethod("qq",function(t,r){var e=/^[1-9]\d{4,9}$/;return this.optional(r)||e.test(t)},"qq号码格式错误"),jQuery.validator.addMethod("ip",function(t,r){var e=/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;return this.optional(r)||e.test(t)&&RegExp.$1<256&&RegExp.$2<256&&RegExp.$3<256&&RegExp.$4<256},"Ip地址格式错误"),jQuery.validator.addMethod("chrnum",function(t,r){var e=/^([a-zA-Z0-9]+)$/;return this.optional(r)||e.test(t)},"只能输入数字和字母(字符A-Z, a-z, 0-9)"),jQuery.validator.addMethod("chinese",function(t,r){var e=/^[\u4e00-\u9fa5]+$/;return this.optional(r)||e.test(t)},"只能输入中文"),jQuery.validator.addMethod("chineseName",function(t,r){var e=/^[\u4e00-\u9fa5]{1,6}$/;return this.optional(r)||e.test(t)},"只能输入中文，长度1-6位"),$.validator.addMethod("selectNone",function(t){return"请选择"==t},"必须选择一项"),jQuery.validator.addMethod("byteRangeLength",function(t,r,e){for(var i=t.length,n=0;n<t.length;n++)t.charCodeAt(n)>127&&i++;return this.optional(r)||i>=e[0]&&i<=e[1]},$.validator.format("请确保输入的值在{0}-{1}个字节之间(一个中文字算2个字节)")),jQuery.validator.addMethod("stringCheck",function(t,r){return this.optional(r)||/^[\u0391-\uFFE5\w]+$/.test(t)},"只能包括中文字、英文字母、数字和下划线"),jQuery.validator.addMethod("byteRangeLength",function(t,r,e){for(var i=t.length,n=0;n<t.length;n++)t.charCodeAt(n)>127&&i++;return this.optional(r)||i>=e[0]&&i<=e[1]},"请确保输入的值在3-15个字节之间(一个中文字算2个字节)"),jQuery.validator.addMethod("isIdCardNo",function(r,e){return this.optional(e)||t(r)},"请正确输入您的身份证号码"),jQuery.validator.addMethod("isMobile",function(t,r){var e=t.length,i=/^[1][3578]\d{9}$/;return this.optional(r)||11==e&&i.test(t)},"请正确填写您的手机号码"),jQuery.validator.addMethod("isTel",function(t,r){var e=/^\d{3,4}-?\d{7,9}$/;return this.optional(r)||e.test(t)},"请正确填写您的电话号码"),jQuery.validator.addMethod("isPhone",function(t,r){var e=(t.length,/^[1][3578]\d{9}$/),i=/^\d{3,4}-?\d{7,9}$/;return this.optional(r)||i.test(t)||e.test(t)},"请正确填写您的联系电话"),jQuery.validator.addMethod("isZipCode",function(t,r){var e=/^[0-9]{6}$/;return this.optional(r)||e.test(t)},"请正确填写您的邮政编码"),jQuery.validator.addMethod("mobileOrEmail",function(t,r){var e=t.length,i=/^[1][3578]\d{9}$/,n=this.optional(r)||/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(t),a=this.optional(r)||11==e&&i.test(t);return n||a},"手机号或邮箱格式错误"),jQuery.validator.addMethod("numOrChar",function(t,r){var e=/^[A-Za-z0-9]+$/;return this.optional(r)||e.test(t)},"只能输入数字或者字母哦")});