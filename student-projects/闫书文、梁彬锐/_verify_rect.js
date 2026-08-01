const fs=require('fs');
const p='C:/Users/Administrator/WorkBuddy/2026-07-12-09-34-02/math-practice.html';
const s=fs.readFileSync(p,'utf8');
let ok=true; const A=(c,m)=>{ if(!c){ok=false; console.log('FAIL:',m);} else console.log('PASS:',m); };

A(!s.includes('sxClip'),'no sxClip reference (clip-path removed)');
A(!s.includes('sx-frame'),'no sx-frame element');
A(!s.includes('sx-stroke'),'no sx-stroke classes');
A(!s.includes('clip-path'),'no clip-path in CSS');
A(/border:3px solid #6e4b2a;border-radius:14px;overflow:hidden;/.test(s),'rectangular wooden border restored');
A(/box-shadow:var\(--shadow\), inset 0 0 0 2px rgba\(247,233,200,\.45\)/.test(s),'rectangular inset cream line restored');
A(/zoomControl:true, attributionControl:true,/.test(s),'Leaflet zoomControl re-enabled');
// terrain scaling group removed (no scale(1.32))
A(!s.includes('scale(1.32)'),'terrain scaling group removed (back to centered ink)');
// province outline stroke re-added
A(/<!-- 省域轮廓线 -->/.test(s),'province outline stroke re-added');
// div balance
A((s.match(/<div/g)||[]).length===(s.match(/<\/div>/g)||[]).length,'div tags balanced');
// svg balance inside bg
const bg=s.indexOf('<div class="bg">');
const bgEnd=s.indexOf('</svg></div>',bg);
const svgOpen=(s.slice(bg,bgEnd).match(/<svg/g)||[]).length;
const svgClose=(s.slice(bg,bgEnd).match(/<\/svg>/g)||[]).length;
A(svgOpen===svgClose,'svg tags balanced in bg block');
// script syntax
const m=s.match(/<script>([\s\S]*?)<\/script>/);
try{ new Function(m[1]); A(true,'inline script syntax OK'); }catch(e){ A(false,'script: '+e.message); }
console.log(ok?'\nALL PASS':'\nSOME FAILED'); process.exit(ok?0:1);
