/* Aurora Bistro — Shared JS Utilities */
(function(){
  'use strict';

  /* ── Nav scroll effect ── */
  const nav = document.getElementById('aurora-nav');
  if(nav){
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();

    // Active link
    const links = nav.querySelectorAll('.nav-link');
    const here = location.pathname.split('/').pop() || 'index.html';
    links.forEach(l => {
      if(l.getAttribute('href') === here) l.classList.add('active');
    });
  }

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  if(revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting){
          const delay = e.target.dataset.delay || 0;
          setTimeout(() => e.target.classList.add('visible'), delay);
        }
      });
    },{threshold:0.12});
    revealEls.forEach(el => io.observe(el));
  }

  /* ── Liquid button ripple ── */
  document.querySelectorAll('.btn-liquid').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--rx', (e.clientX - r.left)+'px');
      btn.style.setProperty('--ry', (e.clientY - r.top)+'px');
    });
  });

  /* ── 3D tilt card ── */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y*12}deg) rotateY(${x*12}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── Parallax on hero ── */
  const heroParallax = document.querySelectorAll('[data-depth]');
  if(heroParallax.length){
    document.addEventListener('mousemove', e => {
      const cx = e.clientX / window.innerWidth  - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      heroParallax.forEach(el => {
        const d = parseFloat(el.dataset.depth) || 1;
        el.style.transform = `translate(${cx*d*40}px,${cy*d*25}px)`;
      });
    });
  }

  /* ── Counter animation ── */
  window.animateCounter = function(el, target, duration, prefix, suffix){
    prefix = prefix || '';
    suffix = suffix || '';
    let start = null;
    const step = ts => {
      if(!start) start = ts;
      const p = Math.min((ts-start)/duration, 1);
      const ease = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
      el.textContent = prefix + Math.round(ease * target) + suffix;
      if(p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ── Star render ── */
  window.renderStars = function(container, rating){
    container.innerHTML = '';
    for(let i=1;i<=5;i++){
      const s = document.createElement('span');
      s.className = 'star' + (i <= Math.round(rating) ? '' : ' empty');
      s.textContent = '★';
      container.appendChild(s);
    }
  };

  /* ── Toast ── */
  window.showToast = function(msg, type){
    type = type || 'success';
    const colors = {success:'#c49a38',error:'#c03a10',info:'#4080c0'};
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;bottom:28px;right:28px;z-index:9999;padding:14px 22px;border-radius:10px;background:var(--bg-card);border:1px solid ${colors[type]}44;color:var(--text-warm);font-size:14px;font-family:var(--font-sans);box-shadow:0 8px 32px rgba(0,0,0,0.6);animation:slideInRight 0.4s ease forwards;display:flex;align-items:center;gap:10px;max-width:320px;`;
    const icon = {success:'✓',error:'✕',info:'ℹ'}[type];
    t.innerHTML = `<span style="color:${colors[type]};font-weight:700;font-size:16px">${icon}</span>${msg}`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(20px)'; t.style.transition='all 0.3s'; setTimeout(()=>t.remove(),300); }, 3500);
  };

})();
