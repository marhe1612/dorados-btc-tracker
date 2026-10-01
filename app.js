(()=>{
const config=window.APP_CONFIG||{variant:'team'};
const family=config.variant==='family';
const storageKey=family?'dorados_btc_family_v2':'dorados_btc_team_v2';
const teams=['DORADOS BTC','RENDER CLUB (ASCENCION)','TEPORACAS','LOBAS DELICIAS','WOLVES CLUB PARRAL','VAQUERAS SAUCILLO'];
const games=[
{id:1,day:'Viernes',date:'2 Oct',time:'17:45',court:'BTC 1',a:'RENDER CLUB (ASCENCION)',b:'DORADOS BTC'},
{id:2,day:'Viernes',date:'2 Oct',time:'19:30',court:'BTC 1',a:'TEPORACAS',b:'DORADOS BTC'},
{id:3,day:'Viernes',date:'2 Oct',time:'20:15',court:'BTC 1',a:'RENDER CLUB (ASCENCION)',b:'TEPORACAS'},
{id:4,day:'Sábado',date:'3 Oct',time:'08:15',court:'BTC 3',a:'LOBAS DELICIAS',b:'DORADOS BTC'},
{id:5,day:'Sábado',date:'3 Oct',time:'08:15',court:'BTC 4',a:'WOLVES CLUB PARRAL',b:'RENDER CLUB (ASCENCION)'},
{id:6,day:'Sábado',date:'3 Oct',time:'09:00',court:'BTC 3',a:'LOBAS DELICIAS',b:'VAQUERAS SAUCILLO'},
{id:7,day:'Sábado',date:'3 Oct',time:'11:30',court:'BTC 3',a:'WOLVES CLUB PARRAL',b:'VAQUERAS SAUCILLO'},
{id:8,day:'Sábado',date:'3 Oct',time:'12:00',court:'BTC 3',a:'VAQUERAS SAUCILLO',b:'RENDER CLUB (ASCENCION)'},
{id:9,day:'Sábado',date:'3 Oct',time:'12:45',court:'BTC 3',a:'WOLVES CLUB PARRAL',b:'TEPORACAS'},
{id:10,day:'Sábado',date:'3 Oct',time:'15:45',court:'BTC 1',a:'TEPORACAS',b:'VAQUERAS SAUCILLO'},
{id:11,day:'Sábado',date:'3 Oct',time:'16:15',court:'BTC 1',a:'WOLVES CLUB PARRAL',b:'DORADOS BTC'},
{id:12,day:'Sábado',date:'3 Oct',time:'17:00',court:'BTC 1',a:'TEPORACAS',b:'LOBAS DELICIAS'},
{id:13,day:'Sábado',date:'3 Oct',time:'19:15',court:'BTC 1',a:'WOLVES CLUB PARRAL',b:'LOBAS DELICIAS'},
{id:14,day:'Sábado',date:'3 Oct',time:'19:45',court:'BTC 1',a:'DORADOS BTC',b:'VAQUERAS SAUCILLO'},
{id:15,day:'Sábado',date:'3 Oct',time:'21:00',court:'BTC 1',a:'LOBAS DELICIAS',b:'RENDER CLUB (ASCENCION)'}
];
const dGames=games.filter(g=>g.a==='DORADOS BTC'||g.b==='DORADOS BTC');
const emptyStats=()=>Object.fromEntries(dGames.map(g=>[g.id,{one:0,two:0,ft:0}]));
let state={scores:{},kstats:emptyStats(),history:[]};
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(saved&&saved.scores){state={...state,...saved};if(family) state.kstats={...emptyStats(),...(saved.kstats||{})};}}catch(e){}
function persist(){localStorage.setItem(storageKey,JSON.stringify(state));}
function short(n){return n.replace('RENDER CLUB (ASCENCION)','Render Club').replace('WOLVES CLUB PARRAL','Wolves Parral').replace('VAQUERAS SAUCILLO','Vaqueras Saucillo').replace('LOBAS DELICIAS','Lobas Delicias').replace('DORADOS BTC','Dorados BTC').replace('TEPORACAS','Teporacas');}
function validScore(id){const s=state.scores[id];return s&&Number.isFinite(+s.a)&&Number.isFinite(+s.b)&&+s.a!==+s.b&&+s.a>=0&&+s.b>=0;}
function standings(){const st=Object.fromEntries(teams.map(t=>[t,{team:t,pj:0,w:0,l:0,pf:0,pa:0,diff:0}]));games.forEach(g=>{if(!validScore(g.id))return;const s=state.scores[g.id],A=st[g.a],B=st[g.b];A.pj++;B.pj++;A.pf+=+s.a;A.pa+=+s.b;B.pf+=+s.b;B.pa+=+s.a;if(+s.a>+s.b){A.w++;B.l++;}else{B.w++;A.l++;}});Object.values(st).forEach(x=>x.diff=x.pf-x.pa);return Object.values(st).sort((x,y)=>y.w-x.w||y.diff-x.diff||y.pf-x.pf||x.team.localeCompare(y.team));}
function render(){const st=standings(),d=st.find(x=>x.team==='DORADOS BTC'),rank=st.findIndex(x=>x.team==='DORADOS BTC')+1;document.getElementById('record').textContent=`${d.w}-${d.l}`;document.getElementById('rank').textContent=d.pj?`${rank}º`:'—';document.getElementById('played').textContent=`${d.pj}/5`;
const next=dGames.find(g=>!validScore(g.id));document.getElementById('nextgame').textContent=next?`${next.day} ${next.time} · ${next.court} · vs ${short(next.a==='DORADOS BTC'?next.b:next.a)}`:'Fase regular terminada';
let status=`Clasifican los primeros 4 de 6. Dorados lleva ${d.w}-${d.l}`;if(d.pj)status+=` y está provisionalmente ${rank}º`;if(d.pj===5)status=rank<=4?`Dorados termina provisionalmente ${rank}º y está en zona de semifinales.`:`Dorados termina provisionalmente ${rank}º, fuera del Top 4.`;document.getElementById('status').textContent=status;
document.getElementById('agenda').innerHTML=dGames.map(g=>{const s=state.scores[g.id],opp=short(g.a==='DORADOS BTC'?g.b:g.a);return `<div class="row"><div><b>${g.day} ${g.time}</b><div class="small">${g.court} · vs ${opp}</div></div><b>${validScore(g.id)?`${s.a}–${s.b}`:'—'}</b></div>`}).join('');
renderGames();document.getElementById('tablebody').innerHTML=st.map((x,i)=>`<tr class="${x.team==='DORADOS BTC'?'dorados':''}"><td><b>${i+1}. ${short(x.team)}</b></td><td>${x.pj}</td><td>${x.w}</td><td>${x.l}</td><td>${x.pf}</td><td>${x.pa}</td><td>${x.diff>0?'+':''}${x.diff}</td></tr>`).join('');
const left=5-d.pj,rem=dGames.filter(g=>!validScore(g.id));document.getElementById('scenario').innerHTML=`<div class="row"><span>Victorias actuales</span><b>${d.w}</b></div><div class="row"><span>Partidos restantes</span><b>${left}</b></div><div class="row"><span>Máximo de victorias</span><b>${d.w+left}</b></div><div style="margin-top:12px;font-size:14px;line-height:1.55">${left?`Rivales restantes: ${rem.map(g=>short(g.a==='DORADOS BTC'?g.b:g.a)).join(', ')}. La posición exacta todavía puede depender de resultados ajenos y del criterio oficial de desempate.`:`Fase regular completa. Revisa la tabla y el cruce provisional del domingo.`}</div>`;
document.getElementById('bracket').innerHTML=`<div class="matchcard"><div class="small">SEMIFINAL 1 · 9:30</div><b>${st[0].pj?short(st[0].team):'1º ubicado'} <span class="gold">vs</span> ${st[3].pj?short(st[3].team):'4º ubicado'}</b></div><div class="matchcard"><div class="small">SEMIFINAL 2 · 9:45</div><b>${st[1].pj?short(st[1].team):'2º ubicado'} <span class="gold">vs</span> ${st[2].pj?short(st[2].team):'3º ubicado'}</b></div><div class="matchcard"><div class="small">FINAL · 10:45</div><b>Ganador SF1 <span class="gold">vs</span> Ganador SF2</b></div>`;
if(family) renderKiara();}
function renderGames(){const box=document.getElementById('games');box.innerHTML=games.map(g=>{const s=state.scores[g.id]||{};return `<div class="game"><div class="small">${g.day} ${g.date} · ${g.time} · ${g.court}</div><div class="scoreline"><div class="team-a">${short(g.a)}</div><input aria-label="Puntos ${short(g.a)}" data-id="${g.id}" data-side="a" type="number" min="0" max="99" inputmode="numeric" value="${s.a??''}"><b style="text-align:center">–</b><input aria-label="Puntos ${short(g.b)}" data-id="${g.id}" data-side="b" type="number" min="0" max="99" inputmode="numeric" value="${s.b??''}"><div class="team-b">${short(g.b)}</div></div><button class="savebtn" data-save="${g.id}">Guardar marcador</button></div>`}).join('');box.querySelectorAll('[data-save]').forEach(btn=>btn.addEventListener('click',()=>{const id=+btn.dataset.save,a=box.querySelector(`input[data-id="${id}"][data-side="a"]`),b=box.querySelector(`input[data-id="${id}"][data-side="b"]`);if(a.value===''||b.value===''||+a.value===+b.value||+a.value<0||+b.value<0){alert('Ingresa un marcador válido sin empate.');return;}state.scores[id]={a:+a.value,b:+b.value};persist();render();}));}
function renderKiara(){let t={one:0,two:0,ft:0};Object.values(state.kstats).forEach(s=>{t.one+=s.one||0;t.two+=s.two||0;t.ft+=s.ft||0});document.getElementById('k1').textContent=t.one;document.getElementById('k2').textContent=t.two;document.getElementById('kft').textContent=t.ft;document.getElementById('kpts').textContent=t.one+2*t.two+t.ft;document.getElementById('kdetail').innerHTML=dGames.map(g=>{const s=state.kstats[g.id]||{one:0,two:0,ft:0},p=s.one+2*s.two+s.ft;return `<div class="row"><span>${g.day} ${g.time} · vs ${short(g.a==='DORADOS BTC'?g.b:g.a)}</span><b>${p} pts</b></div>`}).join('');}
document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.nav button').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));document.getElementById('panel-'+b.dataset.tab).classList.add('active');}));
document.getElementById('reset').addEventListener('click',()=>{if(confirm('¿Borrar todos los marcadores guardados en este dispositivo?')){state.scores={};persist();render();}});
if(family){const sel=document.getElementById('kgame');sel.innerHTML=dGames.map(g=>`<option value="${g.id}">${g.day} ${g.time} · vs ${short(g.a==='DORADOS BTC'?g.b:g.a)}</option>`).join('');document.querySelectorAll('[data-stat]').forEach(btn=>btn.addEventListener('click',()=>{const id=+sel.value,k=btn.dataset.stat;state.kstats[id][k]=(state.kstats[id][k]||0)+1;state.history.push({id,k});persist();renderKiara();}));document.getElementById('undo').addEventListener('click',()=>{const h=state.history.pop();if(h&&state.kstats[h.id]&&state.kstats[h.id][h.k]>0){state.kstats[h.id][h.k]--;persist();renderKiara();}});}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
render();
})();
