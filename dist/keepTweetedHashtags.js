/* see https://github.com/munierujp/marindeck-scripts */
(()=>{'use strict';var e={948:(e,t)=>{Object.defineProperty(t,'__esModule',{value:!0}),t.extractHashtags=void 0;t.extractHashtags=e=>window.twttrTxt.extractHashtags(e)},737:(e,t,o)=>{Object.defineProperty(t,'__esModule',{value:!0}),t.onComposerDisabledStateChange=void 0;const r=o(652),n=()=>document.querySelector('.drawer[data-drawer="compose"] textarea.js-compose-text')??void 0;t.onComposerDisabledStateChange=e=>{const t=new MutationObserver((()=>{const t=n();e(t?.disabled??!1)}));(0,r.onComposerShown)((e=>{if(!e)return void t.disconnect();const o=n();void 0!==o&&t.observe(o,{attributes:!0,attributeFilter:['disabled']})}))}},652:(e,t)=>{Object.defineProperty(t,'__esModule',{value:!0}),t.onComposerShown=void 0;const o='textarea.js-compose-text',r=e=>e instanceof HTMLElement&&null!==e.querySelector(o);t.onComposerShown=e=>{const t=document.querySelector('.app-content');if(null===t)throw new Error('Not found drawer (`.app-content`)');let n;const s=s=>{if(s.length>0){const t=s.some((({addedNodes:e})=>Array.from(e).some((e=>r(e)))));if(s.some((({removedNodes:e})=>Array.from(e).some((e=>r(e)))))&&t)return e(!1),n=!1,void requestAnimationFrame((()=>{e(!0),n=!0}))}if(1!==(t?.querySelectorAll(o)??[]).length)return!0!==n&&void 0!==n||e(!1),void(n=!1);!1!==n&&void 0!==n||e(!0),n=!0},a=new MutationObserver(s);return a.observe(t,{childList:!0,subtree:!0}),s([]),()=>{a.disconnect()}}},829:(e,t)=>{Object.defineProperty(t,'__esModule',{value:!0}),t.sleep=void 0;t.sleep=async e=>await new Promise((t=>{setTimeout(t,e)}))}},t={};function o(r){var n=t[r];if(void 0!==n)return n.exports;var s=t[r]={exports:{}};return e[r](s,s.exports,o),s.exports}(()=>{const e=o(948),t=o(737),r=o(652),n=o(829);!function(){const o='textarea.js-compose-text';(async()=>{await(0,n.sleep)(1e3);let s=[];document.body.addEventListener('keyup',(({target:t})=>{if(!(t instanceof HTMLTextAreaElement&&t.matches(o)))return;const r=(0,e.extractHashtags)(t.value);s=r}),!0);const a=()=>{if(0===s.length)return;const e=document.querySelector(o);null!==e&&(e.value=` ${s.map((e=>`#${e}`)).join(' ')}`,e.selectionStart=0,e.selectionEnd=0,e.dispatchEvent(new Event('change')))};(0,t.onComposerDisabledStateChange)((e=>{e||a()})),(0,r.onComposerShown)((e=>{e&&a()}))})().catch((e=>console.error(e)))}()})()})();