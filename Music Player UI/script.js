const tracks=[
  {title:'Midnight Drive',artist:'Synthwave Bros',duration:214,color:['#7c3aed','#2563eb']},
  {title:'Neon Lights',artist:'Electric Feel',duration:187,color:['#ec4899','#8b5cf6']},
  {title:'Ocean Breeze',artist:'Chill Vibes',duration:235,color:['#0891b2','#059669']},
  {title:'City Pulse',artist:'Urban Beats',duration:198,color:['#d97706','#ef4444']},
  {title:'Lost in Space',artist:'Cosmic Radio',duration:261,color:['#7c3aed','#0f172a']},
];

let current=0, playing=false, progress=0, shuffle=false, repeat=false;
let elapsed=0, timer=null;

const artCanvas=document.getElementById('artCanvas');
const vizCanvas=document.getElementById('vizCanvas');
const actx=artCanvas.getContext('2d');
const vctx=vizCanvas.getContext('2d');
let vizBars=Array.from({length:40},()=>Math.random()*0.3+0.05);

function drawArt(t){
  const w=artCanvas.width=artCanvas.offsetWidth||200;
  const h=artCanvas.height=artCanvas.offsetHeight||200;
  const g=actx.createLinearGradient(0,0,w,h);
  g.addColorStop(0,t.color[0]); g.addColorStop(1,t.color[1]);
  actx.fillStyle=g; actx.fillRect(0,0,w,h);
  actx.fillStyle='rgba(0,0,0,.25)';
  for(let i=0;i<6;i++){
    const r=30+i*20;
    actx.beginPath();
    actx.arc(w*.6,h*.4,r,0,Math.PI*2);
    actx.fill();
  }
  actx.fillStyle='rgba(255,255,255,.06)';
  actx.beginPath(); actx.arc(w*.2,h*.7,60,0,Math.PI*2); actx.fill();
  actx.fillStyle='rgba(255,255,255,.9)';
  actx.font='bold 28px sans-serif'; actx.textAlign='center';
  actx.fillText('♪',w/2,h/2+10);
}

function drawViz(){
  const w=vizCanvas.width=vizCanvas.offsetWidth||200;
  const h=vizCanvas.height=60;
  vctx.clearRect(0,0,w,h);
  const bw=w/vizBars.length;
  vizBars.forEach((v,i)=>{
    const bh=v*h;
    const g=vctx.createLinearGradient(0,h-bh,0,h);
    g.addColorStop(0,'rgba(167,139,250,.9)');
    g.addColorStop(1,'rgba(124,58,237,.2)');
    vctx.fillStyle=g;
    vctx.fillRect(i*bw+1,h-bh,bw-2,bh);
  });
}

function animateViz(){
  if(playing){
    vizBars=vizBars.map(v=>{
      const target=Math.random();
      return v+(target-v)*0.15;
    });
  } else {
    vizBars=vizBars.map(v=>v*0.92+0.02);
  }
  drawViz();
  requestAnimationFrame(animateViz);
}

function fmt(s){ return Math.floor(s/60)+':'+(s%60<10?'0':'')+Math.floor(s%60); }

function renderList(){
  const list=document.getElementById('trackList');
  list.innerHTML=tracks.map((t,i)=>`
    <div class="track-item ${i===current?'playing':''}" onclick="playTrack(${i})">
      <span class="track-num">${i===current&&playing?'<span class="playing-dot"></span>':(i+1)}</span>
      <div class="track-info">
        <div class="track-name">${t.title}</div>
        <div class="track-dur">${fmt(t.duration)}</div>
      </div>
    </div>`).join('');
}

function loadTrack(i){
  current=i; elapsed=0;
  const t=tracks[i];
  document.getElementById('songTitle').textContent=t.title;
  document.getElementById('songArtist').textContent=t.artist;
  document.getElementById('duration').textContent=fmt(t.duration);
  document.getElementById('elapsed').textContent='0:00';
  document.getElementById('progFill').style.width='0%';
  drawArt(t);
  renderList();
}

function togglePlay(){
  playing=!playing;
  document.getElementById('playBtn').textContent=playing?'⏸':'▶';
  if(playing){
    timer=setInterval(()=>{
      elapsed++;
      const t=tracks[current];
      if(elapsed>=t.duration){
        if(repeat){ elapsed=0; }
        else { next(); return; }
      }
      const pct=(elapsed/t.duration)*100;
      document.getElementById('progFill').style.width=pct+'%';
      document.getElementById('elapsed').textContent=fmt(elapsed);
    },1000);
  } else {
    clearInterval(timer);
  }
}

function playTrack(i){
  if(playing){ clearInterval(timer); playing=false; }
  loadTrack(i);
  playing=true;
  document.getElementById('playBtn').textContent='⏸';
  timer=setInterval(()=>{
    elapsed++;
    const t=tracks[current];
    if(elapsed>=t.duration){ next(); return; }
    const pct=(elapsed/t.duration)*100;
    document.getElementById('progFill').style.width=pct+'%';
    document.getElementById('elapsed').textContent=fmt(elapsed);
  },1000);
  renderList();
}

function next(){
  clearInterval(timer); playing=false;
  const ni=shuffle?Math.floor(Math.random()*tracks.length):(current+1)%tracks.length;
  playTrack(ni);
}
function prev(){
  clearInterval(timer); playing=false;
  const pi=(current-1+tracks.length)%tracks.length;
  playTrack(pi);
}
function toggleShuffle(){
  shuffle=!shuffle;
  document.getElementById('shuffleBtn').style.color=shuffle?'#a78bfa':'rgba(255,255,255,.5)';
}
function toggleRepeat(){
  repeat=!repeat;
  document.getElementById('repeatBtn').style.color=repeat?'#a78bfa':'rgba(255,255,255,.5)';
}
function seek(e){
  const bar=document.getElementById('progBar');
  const pct=e.offsetX/bar.offsetWidth;
  elapsed=Math.floor(pct*tracks[current].duration);
  document.getElementById('progFill').style.width=(pct*100)+'%';
  document.getElementById('elapsed').textContent=fmt(elapsed);
}
function setVol(v){ /* volume UI only */ }

loadTrack(0);
animateViz();
