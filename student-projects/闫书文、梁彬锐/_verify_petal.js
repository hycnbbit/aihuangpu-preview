const fs=require('fs');
const s=fs.readFileSync('math-practice.html','utf8');
let fail=0; const ok=(c,m)=>{console.log((c?'PASS':'FAIL')+' '+m); if(!c) fail++;};

// all <script> blocks parse
const blocks=[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)];
ok(blocks.length>=2,'found >=2 script blocks (got '+blocks.length+')');
blocks.forEach((b,idx)=>{ try{ new Function(b[1]); ok(true,'script #'+idx+' syntax OK'); }catch(e){ ok(false,'script #'+idx+' syntax: '+e.message); } });

// petal CSS present
ok(/\.petal-layer\{/.test(s),'.petal-layer CSS present');
ok(/@keyframes petalfall/.test(s),'petalfall keyframes present');
ok(/@keyframes petalflut/.test(s),'petalflut keyframes present');
ok(/\.petal \.leaf\{/.test(s),'.petal .leaf style present');
ok(/prefers-reduced-motion/.test(s),'respects reduced-motion');
// petal JS present and creates layer
ok(/className='petal-layer'/.test(s),'petal layer created in JS');
ok(/createElement\('span'\)/.test(s),'petal leaf span created');
ok(/animationDuration/.test(s),'randomized durations applied');
// no transform conflict: outer petal animates via petalfall only (translate3d+rotate), leaf via petalflut
ok(!/class="petal"[^>]*style="[^"]*animation-name:petalflut/.test(s),'no transform conflict: petal vs leaf separated');
// tag balance
const so=(s.match(/<svg/g)||[]).length, sc=(s.match(/<\/svg>/g)||[]).length; ok(so===sc,'svg '+so+'/'+sc);
const go=(s.match(/<g[ >]/g)||[]).length, gc=(s.match(/<\/g>/g)||[]).length; ok(go===gc,'g '+go+'/'+gc);
const dpo=(s.match(/<div[ >]/g)||[]).length, dpc=(s.match(/<\/div>/g)||[]).length; ok(dpo===dpc,'div '+dpo+'/'+dpc);
const sp=(s.match(/<script>/g)||[]).length, spc=(s.match(/<\/script>/g)||[]).length; ok(sp===spc,'script '+sp+'/'+spc);

console.log(fail===0?'\nALL PASS':'\n'+fail+' FAILED'); process.exit(fail?1:0);
