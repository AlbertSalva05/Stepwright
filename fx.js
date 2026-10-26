// Stepwright motion layer: hero constellation and heading/paragraph reveals. Plain JS, no libraries.
(function(){
  if(window.__swFx)return;window.__swFx=1;
  const RM=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  function constellation(cv){
    if(cv._sw)return;cv._sw=1;
    const host=cv.parentElement,ctx=cv.getContext('2d');
    let W=0,H=0,nodes=[],ptr=null,raf=0,last=0,color='#2e6146',visible=true,colorT=0;
    const readColor=()=>{color=getComputedStyle(cv).color||color};
    const mk=()=>{const a=Math.random()*Math.PI*2,s=8+Math.random()*16;return{x:Math.random()*W,y:Math.random()*H,vx:Math.cos(a)*s,vy:Math.sin(a)*s}};
    function size(){
      const dpr=Math.min(2,window.devicePixelRatio||1);W=host.clientWidth;H=host.clientHeight;
      cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
      // Pair checks are O(n^2): fewer nodes on small screens
      const n=W<640?30:W<1024?42:56;while(nodes.length<n)nodes.push(mk());nodes.length=n;
      nodes.forEach(p=>{p.x=Math.min(p.x,W);p.y=Math.min(p.y,H)});draw();
    }
    function draw(){
      ctx.clearRect(0,0,W,H);const R=Math.min(W,H)*0.3,pts=ptr?nodes.concat([ptr]):nodes;
      ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=1;
      for(let i=0;i<pts.length;i++){const a=pts[i];for(let j=i+1;j<pts.length;j++){const b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<R){ctx.globalAlpha=0.4*(1-d/R);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}
      ctx.globalAlpha=0.75;for(const p of nodes){ctx.beginPath();ctx.arc(p.x,p.y,2,0,6.2832);ctx.fill()}ctx.globalAlpha=1;
    }
    function step(t){
      if(!cv.isConnected){cancelAnimationFrame(raf);ro.disconnect();io.disconnect();return}
      const dt=Math.min(0.05,last?(t-last)/1000:0);last=t;
      if(t-colorT>600){colorT=t;readColor()}
      for(const p of nodes){p.x+=p.vx*dt;p.y+=p.vy*dt;
        if(p.x<0){p.x=0;p.vx=Math.abs(p.vx)}else if(p.x>W){p.x=W;p.vx=-Math.abs(p.vx)}
        if(p.y<0){p.y=0;p.vy=Math.abs(p.vy)}else if(p.y>H){p.y=H;p.vy=-Math.abs(p.vy)}}
      draw();raf=requestAnimationFrame(step);
    }
    function start(){cancelAnimationFrame(raf);last=0;readColor();if(RM()||!visible){draw();return}raf=requestAnimationFrame(step)}
    const ro=new ResizeObserver(size);ro.observe(host);
    const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;start()});io.observe(host);
    host.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();ptr={x:e.clientX-r.left,y:e.clientY-r.top};if(RM())draw()});
    host.addEventListener('pointerleave',()=>{ptr=null;if(RM())draw()});
    new MutationObserver(()=>{readColor();draw()}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','class','style']});
    if(window.matchMedia)matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',start);
    size();start();
  }

  // Reveals: an aria-hidden overlay copy animates; the real text stays in the DOM untouched
  const HEAD='#hero h1,.section-heading h2,.page-heading h1';
  const PARA='#hero .hero-banner-copy > p:not(.hero-eyebrow),.section-heading > p,.page-heading > p';
  function wrapWords(node,list){
    [...node.childNodes].forEach(c=>{
      if(c.nodeType===3){const parts=c.nodeValue.split(/(\s+)/),f=document.createDocumentFragment();
        parts.forEach(s=>{if(!s)return;if(/^\s+$/.test(s)){f.appendChild(document.createTextNode(s));return}
          const w=document.createElement('span');w.textContent=s;w.style.cssText='display:inline-block;opacity:0;will-change:filter,opacity,transform';f.appendChild(w);list.push(w)});
        c.replaceWith(f)}
      else if(c.nodeType===1)wrapWords(c,list)});
  }
  function prep(el,mode){
    if(el.dataset.rv||el.closest('[data-skel]'))return;
    const txt=(el.textContent||'').trim();if(!txt||el.offsetParent===null)return;
    if(mode==='lines'&&/mono/i.test(getComputedStyle(el).fontFamily)){el.dataset.rv='skip';return}
    el.dataset.rv='1';if(RM())return;
    const words=txt.split(/\s+/).length;
    if(mode==='words'&&words>12)mode='lines'; // never blur more than a dozen words
    const ov=document.createElement('span');ov.setAttribute('aria-hidden','true');ov.dataset.rvOv='';
    ov.style.cssText='position:absolute;inset:0;pointer-events:none;-webkit-text-fill-color:currentcolor;user-select:none';
    el.childNodes.forEach(c=>{if(c!==ov)ov.appendChild(c.cloneNode(true))});
    ov.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
    const list=[];wrapWords(ov,list);
    if(getComputedStyle(el).position==='static')el.style.position='relative';
    el.style.webkitTextFillColor='transparent';el.appendChild(ov);
    const io=new IntersectionObserver(es=>{if(!es[0].isIntersecting)return;io.disconnect();run(el,ov,list,mode)},{threshold:mode==='words'?0.5:0.4});
    io.observe(el);
  }
  function run(el,ov,list,mode){
    let end=0;
    if(mode==='words'){list.forEach((w,i)=>{const d=i*160;w.style.animation=`swBlurIn 800ms cubic-bezier(.32,.72,0,1) ${d}ms both`;end=Math.max(end,d+800)})}
    else{let top=null,line=-1;list.forEach(w=>{if(w.offsetTop!==top){top=w.offsetTop;line++}const d=line*170;w.style.willChange='opacity,transform';w.style.animation=`swLineIn 700ms cubic-bezier(.32,.72,0,1) ${d}ms both`;end=Math.max(end,d+700)})}
    setTimeout(()=>{ov.remove();el.style.webkitTextFillColor=''},end+60);
  }
  // Direction-aware hover: overlay enters from the edge the pointer crossed and leaves toward the exit edge
  const OFF={left:'translate3d(-101%,0,0)',right:'translate3d(101%,0,0)',top:'translate3d(0,-101%,0)',bottom:'translate3d(0,101%,0)'};
  function side(card,e){const r=card.getBoundingClientRect(),dx=(e.clientX-r.left)/r.width-.5,dy=(e.clientY-r.top)/r.height-.5;return Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'top':'bottom')}
  function dirHover(card){
    if(card._sw)return;const ov=card.querySelector('[data-dir-overlay]');if(!ov)return;card._sw=1;
    let shown=false,touchTap=false;
    const enter=s=>{ov.style.transition='none';ov.style.transform=OFF[s];void ov.offsetWidth;ov.style.transition='';ov.style.transform='none';shown=true};
    const leave=s=>{ov.style.transform=OFF[s];shown=false};
    card.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;enter(side(card,e))});
    card.addEventListener('pointerleave',e=>{if(e.pointerType==='touch')return;leave(side(card,e))});
    card.addEventListener('focusin',()=>{if(!shown)enter('left')});
    card.addEventListener('focusout',e=>{if(!card.contains(e.relatedTarget))leave('right')});
    // Touch: first tap shows the overlay, second tap follows the link
    card.addEventListener('pointerdown',e=>{touchTap=e.pointerType==='touch'});
    card.addEventListener('click',e=>{if(!touchTap||e.target.closest('a'))return;touchTap=false;if(!shown){e.preventDefault();document.querySelectorAll('[data-dir-hover]').forEach(c=>{if(c!==card&&c._leave)c._leave()});enter(side(card,e))}});
    card._leave=()=>{if(shown)leave('right')};
  }
  // Hero stats: count up, then the accent fill wipes in over the outlined number. Only clip-path animates on the fill
  const EZ='cubic-bezier(.32,.72,0,1)',SHOW='inset(0 0 0 0)',HIDE_L='inset(0 100% 0 0)',HIDE_R='inset(0 0 0 100%)';
  function fillNum(el){
    if(el._sw)return;el._sw=1;
    const target=+el.dataset.fillNum,out=el.querySelector('[data-fill-out]'),top=el.querySelector('[data-fill-top]');
    const set=v=>{out.textContent=v;top.textContent=v};
    if(RM()){top.style.clipPath='none';return}
    set(0);let busy=false;
    const wipeIn=()=>top.animate([{clipPath:HIDE_L},{clipPath:SHOW}],{duration:900,easing:EZ,fill:'forwards'}).finished;
    const io=new IntersectionObserver(es=>{if(!es[0].isIntersecting)return;io.disconnect();busy=true;
      const t0=performance.now(),dur=1100;
      (function tick(now){const p=Math.min(1,(now-t0)/dur);set(Math.round(target*(1-Math.pow(1-p,3))));
        if(p<1)requestAnimationFrame(tick);else wipeIn().then(()=>{busy=false})})(t0);
    },{threshold:0.5});io.observe(el);
    const link=el.closest('a')||el;
    const replay=()=>{if(busy||RM())return;busy=true;
      top.animate([{clipPath:SHOW},{clipPath:HIDE_R}],{duration:420,easing:EZ,fill:'forwards'}).finished.then(wipeIn).then(()=>{busy=false})};
    link.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')replay()});
    link.addEventListener('focus',replay);
  }
  let t=0;
  function scan(){clearTimeout(t);t=setTimeout(()=>{
    document.querySelectorAll('[data-fill-num]').forEach(fillNum);
    document.querySelectorAll('[data-dir-hover]').forEach(dirHover);
    document.querySelectorAll('canvas[data-constellation]').forEach(constellation);
    document.querySelectorAll(HEAD).forEach(el=>prep(el,'words'));
    document.querySelectorAll(PARA).forEach(el=>prep(el,'lines'));
  },60)}
  function boot(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true,characterData:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
