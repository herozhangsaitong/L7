!function(e){function t(n){if(o[n])return o[n].exports;var r=o[n]={exports:{},id:n,loaded:!1};return e[n].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var o={};return t.m=e,t.c=o,t.p="",t(0)}({0:function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function r(e,t){window.parent.postMessage(JSON.stringify({type:e,content:t}),"*")}var a=o(18),i=n(a),c=o(8),s=n(c),u=o(17),d=n(u);window.__saveUserId=function(e){i.default.set("userId",e)},window.iframeStartup=function(){window.parent!==window||window.__testMode__?(window.addEventListener("message",function(e){if(e.data){var t=void 0;try{t=JSON.parse(e.data)}catch(e){s.default.log("error parse ",e)}if(t&&t.type)switch(t.type){case"setBucUserId":i.default.set("userId",t.content,{domain:".alipay.com"}),r("getBucUserId",t.content);break;case"getBucUserId":r("getBucUserId",i.default.get("userId",{domain:".alipay.com"}));break;case"storage":(0,d.default)(t)}}},!1),window.onload=function(){var e=i.default.get("userId",{domain:".alipay.com"});r("iframOnload"),r("getBucUserId",e||null)}):s.default.log("DO NOT OPEN ME DIRECTLY!")}},8:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=["log","info","warn","error"],n={};o.forEach(function(e){n[e]=function(){var t;console&&console[e]&&(t=console)[e].apply(t,arguments)}}),t.default=n,e.exports=t.default},17:function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function r(e){window.parent.postMessage(JSON.stringify(e),"*")}function a(e){r({type:"getStorage",key:e,value:localStorage.getItem(e)})}function i(e,t){var o="setStorage";try{localStorage.setItem(e,t),r({type:o,key:e,success:!0})}catch(t){r({type:o,key:e,success:!1}),s.default.log("Tracert \u8bbe\u7f6eStorage\u5931\u8d25",t)}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){if(window.localStorage){var t=e.action,o=e.key,n=e.value;"set"===t&&i(o,n),"get"===t&&a(o)}};var c=o(8),s=n(c);e.exports=t.default},18:function(e,t,o){var n,r;!function(a){var i=!1;if(n=a,r="function"==typeof n?n.call(t,o,t,e):n,!(void 0!==r&&(e.exports=r)),i=!0,e.exports=a(),i=!0,!i){var c=window.Cookies,s=window.Cookies=a();s.noConflict=function(){return window.Cookies=c,s}}}(function(){function e(){for(var e=0,t={};e<arguments.length;e++){var o=arguments[e];for(var n in o)t[n]=o[n]}return t}function t(o){function n(t,r,a){var i;if("undefined"!=typeof document){if(arguments.length>1){if(a=e({path:"/"},n.defaults,a),"number"==typeof a.expires){var c=new Date;c.setMilliseconds(c.getMilliseconds()+864e5*a.expires),a.expires=c}a.expires=a.expires?a.expires.toUTCString():"";try{i=JSON.stringify(r),/^[\{\[]/.test(i)&&(r=i)}catch(e){}r=o.write?o.write(r,t):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),t=encodeURIComponent(String(t)),t=t.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),t=t.replace(/[\(\)]/g,escape);var s="";for(var u in a)a[u]&&(s+="; "+u,a[u]!==!0&&(s+="="+a[u]));return document.cookie=t+"="+r+s}t||(i={});for(var d=document.cookie?document.cookie.split("; "):[],f=/(%[0-9A-Z]{2})+/g,l=0;l<d.length;l++){var p=d[l].split("="),g=p.slice(1).join("=");this.json||'"'!==g.charAt(0)||(g=g.slice(1,-1));try{var v=p[0].replace(f,decodeURIComponent);if(g=o.read?o.read(g,v):o(g,v)||g.replace(f,decodeURIComponent),this.json)try{g=JSON.parse(g)}catch(e){}if(t===v){i=g;break}t||(i[v]=g)}catch(e){}}return i}}return n.set=n,n.get=function(e){return n.call(n,e)},n.getJSON=function(){return n.apply({json:!0},[].slice.call(arguments))},n.defaults={},n.remove=function(t,o){n(t,"",e(o,{expires:-1}))},n.withConverter=t,n}return t(function(){})})}});