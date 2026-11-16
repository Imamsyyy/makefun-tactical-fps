import {createState,newRound,buy,deploy,reload,throwSmoke,step,weapons,walls} from './sim.js';
import {createView} from './view.js';
const s=createState(),canvas=document.querySelector('#scene'),view=createView(canvas,s),input={};
const $=id=>document.getElementById(id),map=$('map').getContext('2d');
let audio=null;
function sound(freq,duration,volume=.03){if(!audio)return;const o=audio.createOscillator(),g=audio.createGain();o.type='triangle';o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(freq*.3,audio.currentTime+duration);g.gain.setValueAtTime(volume,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+duration);}
function lock(){const request=canvas.requestPointerLock?.();request?.catch(()=>{$('resume').textContent='DRAG TO AIM / CLICK TO FIRE · CLICK HERE TO RETRY MOUSE LOCK';});}
$('start').onclick=()=>{audio=new AudioContext();newRound(s);ui();};
for(const el of document.querySelectorAll('[data-buy]'))el.onclick=()=>{$('purchase').textContent=buy(s,el.dataset.buy)?'Equipped. Ready to deploy.':'Insufficient funds or already equipped.';ui();};
$('deploy').onclick=()=>{deploy(s);lock();ui();};
$('next').onclick=()=>{if(Math.max(...s.score)>=4){s.score=[0,0];s.round=0;s.cash=2200;}newRound(s);ui();};
$('resume').onclick=lock;canvas.onclick=()=>{if(s.phase==='live')lock();};
const keys={KeyW:'forward',KeyS:'back',KeyA:'left',KeyD:'right',ShiftLeft:'slow',KeyC:'crouch',ControlLeft:'crouch',KeyE:'use'};
addEventListener('keydown',e=>{if(keys[e.code]){input[keys[e.code]]=true;e.preventDefault();}if(e.repeat)return;if(e.code==='KeyR')reload(s);if(e.code==='KeyG')throwSmoke(s);});
addEventListener('keyup',e=>{if(keys[e.code])input[keys[e.code]]=false;});
addEventListener('blur',()=>{for(const k in input)input[k]=false;});
addEventListener('mousedown',e=>{if(e.button===0&&s.phase==='live'&&(document.pointerLockElement===canvas||e.target===canvas))input.fire=true;});addEventListener('mouseup',()=>input.fire=false);
addEventListener('mousemove',e=>{if(document.pointerLockElement===canvas||(s.phase==='live'&&e.buttons===1&&e.target===canvas)){s.player.yaw-=e.movementX*.0022;s.player.pitch=Math.max(-1.3,Math.min(1.3,s.player.pitch-e.movementY*.0022));}});
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement)for(const k in input)input[k]=false;ui();});
function ui(){
 $('panel').hidden=s.phase!=='briefing';$('shop').hidden=s.phase!=='buy';$('result').hidden=s.phase!=='result';$('resume').hidden=s.phase!=='live'||document.pointerLockElement===canvas;
 $('crew').textContent=s.score[0];$('enemy').textContent=s.score[1];$('round').textContent=String(s.round||1).padStart(2,'0');$('phase').textContent=s.phase.toUpperCase();const t=Math.max(0,Math.ceil(s.armed?s.fuse:s.time));$('timer').textContent=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');$('health').textContent=Math.ceil(s.player.hp);$('armor').textContent=Math.ceil(s.player.armor)+' ARMOR';$('cash').textContent='$'+s.cash;$('balance').textContent='$'+s.cash;$('weapon').textContent=weapons[s.weapon].name;$('ammo').innerHTML=s.ammo+' <em>/ '+s.reserve+'</em>';$('reload').textContent=s.reload?'RELOADING '+s.reload.toFixed(1)+'s':'R / RELOAD';$('grenade').textContent='G / SMOKE × '+s.grenades;$('feed').innerHTML=s.events.join('<br>');$('hit').style.display=s.hit?'block':'none';$('damage').style.opacity=s.flash<0?'.8':'0';$('objectiveText').textContent=s.armed?'UPLINK TRANSMITTING':'CONNECT THE RELAY';$('hint').textContent=s.armed?'Protect A · sentries can sever the connection':'Advance to A · hold E to establish uplink';$('progress').max=s.armed?25:3;$('progress').value=s.armed?25-s.fuse:s.plant;$('crosshair').style.transform=`translate(-50%,-50%) scale(${1+s.recoil+Math.hypot(s.player.vx,s.player.vz)*.12})`;
 $('resultTitle').textContent=s.message;$('reason').textContent=s.outcome;$('resultScore').textContent=s.score.join(' — ');$('next').textContent=Math.max(...s.score)>=4?'NEW OPERATION →':'NEXT ROUND →';
 map.fillStyle='#152f39';map.fillRect(0,0,180,180);map.fillStyle='#668386';for(const [x,z,w,d]of walls)map.fillRect(90+(x-w/2)*4,90+(z-d/2)*4,w*4,d*4);map.fillStyle='#65e9cd';map.fillRect(81,21,18,18);map.fillStyle='#142c34';map.font='bold 12px monospace';map.fillText('A',86,34);for(const b of s.bots){if(b.hp<=0)continue;if(b.team===1&&!b.alert)continue;map.fillStyle=b.team?'#f99b66':'#83f7e1';map.beginPath();map.arc(90+b.x*4,90+b.z*4,3,0,7);map.fill();}map.save();map.translate(90+s.player.x*4,90+s.player.z*4);map.rotate(-s.player.yaw);map.fillStyle='#fff';map.beginPath();map.moveTo(0,-6);map.lineTo(4,4);map.lineTo(-4,4);map.fill();map.restore();
}
let last=performance.now(),acc=0,frames=0;
function frame(now){acc+=Math.min(.1,(now-last)/1000);last=now;while(acc>=1/120){const ammo=s.ammo,hp=s.player.hp;step(s,input,1/120);if(s.ammo<ammo)sound(130,.09,.045);if(s.player.hp<hp)sound(70,.15,.025);acc-=1/120;}if(s.phase==='result'&&document.pointerLockElement)document.exitPointerLock();view.render();if(++frames%3===0)ui();requestAnimationFrame(frame);}ui();requestAnimationFrame(frame);
// Read-only instrumentation for local QA; gameplay is driven through ordinary inputs.
window.saltline={snapshot:()=>JSON.parse(JSON.stringify(s)),renderer:()=>({calls:view.renderer.info.render.calls,triangles:view.renderer.info.render.triangles}),ready:true};
