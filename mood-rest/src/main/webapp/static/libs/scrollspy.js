define("static/libs/scrollspy",["require","exports","module","bootstrap","components/jquery/jquery"],function(t){t("bootstrap");var s=t("components/jquery/jquery"),e=s.fn.scrollspy.Constructor;e.prototype.refresh=function(){var t="offset",e=0;s.isWindow(this.$scrollElement[0])||(t="position",e=this.$scrollElement.scrollTop()),this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight();var o=this;this.$body.find(this.selector).map(function(){var o=s(this),r=o.data("target")||o.attr("href"),i=/^#./.test(r)&&s(/^#[a-zA-Z_\d]+$/.test(r)?r:'[id="'+r.substr(1)+'"]');return i&&i.length&&i.is(":visible")&&[[i[t]().top+e,r]]||null}).sort(function(t,s){return t[0]-s[0]}).each(function(){o.offsets.push(this[0]),o.targets.push(this[1])})}});