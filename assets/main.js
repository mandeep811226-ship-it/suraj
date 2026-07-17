// Scroll reveal
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=> e.target.classList.add('in'), i*70);
        io.unobserve(e.target);
      }
    });
  }, {threshold:.15, rootMargin:'0px 0px -60px 0px'});
  document.querySelectorAll('.reveal').forEach(el=> io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el=> el.classList.add('in'));
}

// Gallery lightbox (Gallery page)
(function(){
  const lb = document.getElementById('lightbox');
  if(!lb) return;
  const lbImg = document.getElementById('lightboxImg');
  document.querySelectorAll('.g-item img').forEach(img=>{
    img.addEventListener('click', ()=>{
      lbImg.src = img.src.replace('w=800','w=1600');
      lbImg.alt = img.alt;
      lb.classList.add('open');
    });
  });
  function closeLb(){ lb.classList.remove('open'); lbImg.src=''; }
  const closeBtn = document.getElementById('lightboxClose');
  if(closeBtn) closeBtn.addEventListener('click', closeLb);
  lb.addEventListener('click', (e)=>{ if(e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeLb(); });
})();

// Gallery category filter (Gallery page)
(function(){
  const row = document.getElementById('filterRow');
  if(!row) return;
  const items = document.querySelectorAll('.g-item');
  row.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      row.querySelectorAll('button').forEach(b=> b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item=>{
        item.classList.toggle('hidden', cat !== 'all' && item.dataset.cat !== cat);
      });
    });
  });
})();

// Showreel play-on-click (Gallery / Home)
document.querySelectorAll('.showreel').forEach(reel=>{
  const video = reel.querySelector('video');
  if(!video) return;
  reel.addEventListener('click', ()=>{
    if(video.paused){ video.muted = false; video.play(); reel.classList.add('playing'); }
    else { video.pause(); reel.classList.remove('playing'); }
  });
});

// Hero background video sound toggle (Home)
(function(){
  const btn = document.getElementById('soundToggle');
  const vid = document.getElementById('heroVideo');
  if(!btn || !vid) return;
  btn.addEventListener('click', ()=>{
    vid.muted = !vid.muted;
    btn.textContent = vid.muted ? '\u{1F507}' : '\u{1F50A}';
  });
})();

// Scroll progress bar
(function(){
  const bar = document.getElementById('scrollProgress');
  if(!bar) return;
  window.addEventListener('scroll', ()=>{
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = pct + '%';
  }, {passive:true});
})();

// Sticky mobile call bar (shows after scrolling past first screen)
(function(){
  const bar = document.getElementById('mobileCallBar');
  if(!bar) return;
  window.addEventListener('scroll', ()=>{
    bar.classList.toggle('show', window.scrollY > window.innerHeight * 0.6);
  }, {passive:true});
})();

// Animated counters
(function(){
  const els = document.querySelectorAll('.count-num');
  if(!els.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const isDecimal = target % 1 !== 0;
      const dur = 1400;
      const start = performance.now();
      function tick(now){
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = (isDecimal ? val.toFixed(1) : Math.round(val)) + suffix;
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, {threshold:.4});
  els.forEach(el=> io.observe(el));
})();

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click', ()=>{
    q.parentElement.classList.toggle('open');
  });
});

// Enquiry form -> WhatsApp
(function(){
  const form = document.getElementById('enquiryForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('eqName').value;
    const date = document.getElementById('eqDate').value;
    const service = document.getElementById('eqService').value;
    const msg = document.getElementById('eqMsg').value;
    let text = `Hi, I'm ${name}. I'd like to enquire about ${service}`;
    if(date) text += ` for ${date}`;
    text += '.';
    if(msg) text += ` ${msg}`;
    window.open(`https://wa.me/917014649182?text=${encodeURIComponent(text)}`, '_blank');
  });
})();

// Before / after slider
document.querySelectorAll('.ba-slider').forEach(slider=>{
  const after = slider.querySelector('.ba-after');
  const handle = slider.querySelector('.ba-handle');
  function setPos(clientX){
    const rect = slider.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    after.style.clipPath = `inset(0 0 0 ${pct}%)`;
    handle.style.left = pct + '%';
  }
  let dragging = false;
  slider.addEventListener('pointerdown', (e)=>{ dragging = true; setPos(e.clientX); });
  window.addEventListener('pointermove', (e)=>{ if(dragging) setPos(e.clientX); });
  window.addEventListener('pointerup', ()=> dragging = false);
});

// Mobile nav
(function(){
  const toggle = document.getElementById('navToggle');
  const panel = document.getElementById('mobileNav');
  const close = document.getElementById('mobileNavClose');
  if(!toggle || !panel) return;
  toggle.addEventListener('click', ()=> panel.classList.add('open'));
  if(close) close.addEventListener('click', ()=> panel.classList.remove('open'));
  panel.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> panel.classList.remove('open')));
})();

// Theme toggle (persisted)
const themeToggle = document.getElementById('themeToggle');
if(themeToggle){
  themeToggle.setAttribute('aria-pressed', String(document.documentElement.classList.contains('light')));
  themeToggle.textContent = document.documentElement.classList.contains('light') ? '\u25D1' : '\u25D0';
  themeToggle.addEventListener('click', ()=>{
    const isLight = document.documentElement.classList.toggle('light');
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.textContent = isLight ? '\u25D1' : '\u25D0';
    try{ localStorage.setItem('theme', isLight ? 'light' : 'dark'); }catch(e){}
  });
}
