function e(e,i,n){var f=n||{},a=f.noTrailing,t=a===void 0?false:a,r=f.noLeading,o=r===void 0?false:r,u=f.debounceMode,d=u===void 0?undefined:u;var v;var s=false;var c=0;function l(){if(v){clearTimeout(v)}}function m(e){var i=e||{},n=i.upcomingOnly,f=n===void 0?false:n;l();s=!f}function D(){for(var n=arguments.length,f=new Array(n),a=0;a<n;a++){f[a]=arguments[a]}var r=this;var u=Date.now()-c;if(s){return}function m(){c=Date.now();i.apply(r,f)}function D(){v=undefined}if(!o&&d&&!v){m()}l();if(d===undefined&&u>e){if(o){c=Date.now();if(!t){v=setTimeout(d?D:m,e)}}else{m()}}else if(t!==true){v=setTimeout(d?D:m,d===undefined?e-u:e)}}D.cancel=m;return D}function i(i,n,f){var a=f||{},t=a.atBegin,r=t===void 0?false:t;return e(i,n,{debounceMode:r!==false})}export{i as d,e as t};
//# sourceMappingURL=p-a74b380d.js.map