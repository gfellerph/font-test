import{s as e}from"./p-c40dce91.js";const n={"Close overlay":{de:"Overlay Schliessen",fr:"Fermer la superposition",it:"Chiudi sovrapposizione"},"Current language is English":{de:"Die aktuelle Sprache ist Deutsch",fr:"La langue actuelle est le français",it:"La lingua corrente è l'italiano"},"Change language":{de:"Sprache wechseln",fr:"Changer de langue",it:"Cambia lingua"},"Go to main content":{de:"Zum Hauptinhalt springen",fr:"Aller au contenu principal",it:"Vai al contenuto principale"},"Go to search":{de:"Zur Suche springen",fr:"Aller à la recherche",it:"Vai alla ricerca"},"Go to login":{de:"Zum Login springen",fr:"Aller au login",it:"Vai al login"},"Open menu":{de:"Menü öffnen",fr:"Ouvrir le menu",it:"Apri il menu"},"Navigate on post.ch":{de:"Navigieren auf post.ch",fr:"Naviguer sur post.ch",it:"Navigate su post.ch"}};const i=(n,i,r,t)=>{if(n.length===0){return undefined}if(n.length===1){return n[0]}const l=new URL(window.location.href);let u=[i,l.searchParams.get("lang"),l.pathname.split("/").find((e=>n.includes(e))),r!==undefined?window.localStorage.getItem(r):null,o("language"),o("lang"),t!==undefined?o(t):null,document.documentElement.lang,a(n),e.currentLanguage].filter((e=>!!e));const s=u.find((e=>n.includes(e)))||n[0];if(!s||s.length!==2){throw new Error(`Current language could not be determined from settings or the language provided (${s}) is not supported by the Header API.`)}return s};const r=(n,i,r)=>{if(r!==undefined){window.localStorage.setItem(r,n)}if(i!==undefined){t(i,n)}e.currentLanguage=n};const o=e=>{var n;return((n=document.cookie.match("(^|;)\\s*"+e+"\\s*=\\s*([^;]+)"))===null||n===void 0?void 0:n.pop())||""};const t=(e,n)=>{document.cookie=`${encodeURIComponent(e)}=${encodeURIComponent(n)}`};const a=e=>{if(navigator.language){const n=l(navigator.language);if(e.indexOf(n)!==-1){return n}}if(navigator.languages){for(const n of navigator.languages){const i=l(n);if(e.indexOf(i)!==-1){return i}}}return null};const l=e=>e.substring(0,2).toLowerCase();const u=(i,r,o=n)=>{var t,a,l;return(l=(t=o[i])===null||t===void 0?void 0:t[(a=r!==null&&r!==void 0?r:e.currentLanguage)!==null&&a!==void 0?a:""])!==null&&l!==void 0?l:i};export{i as g,r as p,u as t};
//# sourceMappingURL=p-d3d78a49.js.map