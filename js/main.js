(function () {
  'use strict';

  const D = window.CLINIC;
  const T = window.I18N;
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  let lang = ['uz', 'ru'].includes(store.get('cm-lang')) ? store.get('cm-lang') : 'uz';
  let activeTag = 'all';
  let query = '';
  let vidType = 'all';
  let docsExpanded = false;
  const MOBILE_DOCS = 4;

  const t = (key) => (T[lang] && T[lang][key] !== undefined ? T[lang][key] : key);

  /* ---------- Icons ---------- */
  const ICONS = {
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.2 12.5h4.3l1.5-3 2 6 1.5-3h4"/>',
    droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    bone: '<path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"/>',
    kidney: '<path d="M8 3C5 3 3 7 3 12s2 9 5 9c2 0 3-1.5 3-3.5S9.5 14 9.5 12 11 8.5 11 6.5 10 3 8 3z"/><path d="M16 3c3 0 5 4 5 9s-2 9-5 9c-2 0-3-1.5-3-3.5s1.5-3.5 1.5-5.5S13 8.5 13 6.5 14 3 16 3z"/>',
    stomach: '<path d="M9 2v4c0 2-3 3-3 7a6 6 0 0 0 6 6h1a6 6 0 0 0 6-6c0-3-2-5-4.5-5S12 9 12 7V2"/><path d="M12 19v3"/>',
    stethoscope: '<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>',
    flower: '<circle cx="12" cy="12" r="3"/><path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5"/><path d="M12 7.5V9M7.5 12H9M16.5 12H15M12 16.5V15"/>',
    ear: '<path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4"/>',
    brain: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v13M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12c1.5-3 3.5-3 5 0s3.5 3 5 0"/>',
    bed: '<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    microscope: '<path d="M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14h-1M9 14h2M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2ZM12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    baby: '<path d="M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>',
    sparkle: '<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/><path d="M19 3v4M17 5h4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    external: '<path d="M7 17 17 7M8 7h9v9"/>'
  };
  const icon = (name, cls = 'i') => `<svg viewBox="0 0 24 24" class="${cls}" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  /* ---------- Helpers ---------- */
  function ruPlural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }
  const yearsLabel = (n) => (lang === 'ru' ? ruPlural(n, 'год', 'года', 'лет') : 'yil');
  const reviewsLabel = (n) => (lang === 'ru' ? ruPlural(n, 'отзыв', 'отзыва', 'отзывов') : 'ta sharh');

  function initials(name) {
    const p = name.split(' ');
    return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase();
  }
  const HUES = [172, 200, 220, 160, 190, 250, 180, 210, 165, 230, 195];

  /* ---------- i18n ---------- */
  function applyI18n() {
    root.setAttribute('lang', lang);
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    $$('.lang-switch button').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
    $('.lang-switch').dataset.active = lang;
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    store.set('cm-lang', lang);
    document.body.classList.add('lang-switching');
    setTimeout(() => {
      renderAll();
      document.body.classList.remove('lang-switching');
    }, reduceMotion ? 0 : 220);
  }

  /* ---------- Theme ---------- */
  function setTheme(next, e) {
    const apply = () => {
      root.setAttribute('data-theme', next);
      store.set('cm-theme', next);
    };
    if (!document.startViewTransition || reduceMotion) { apply(); }
    else {
      const x = e ? e.clientX : innerWidth - 60;
      const y = e ? e.clientY : 40;
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const vt = document.startViewTransition(apply);
      vt.ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 650, easing: 'cubic-bezier(.7,0,.3,1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(() => {});
    }
    toast(t(next === 'dark' ? 'toast.theme.dark' : 'toast.theme.light'));
  }

  /* ---------- Renderers ---------- */
  function renderMarquee() {
    const items = D.directions.map((d) => `<span class="marquee__item">${icon(d.icon)}${t('dir.' + d.key)}</span>`).join('');
    $('#marqueeTrack').innerHTML = items + items;
  }

  function renderDirections() {
    $('#dirGrid').innerHTML = D.directions.map((d, i) => `
      <article class="dir-card reveal spotlight tilt" style="--d:${(i % 5) * 70}ms">
        <span class="dir-card__num">${String(i + 1).padStart(2, '0')}</span>
        <span class="dir-card__icon">${icon(d.icon)}</span>
        <h3>${t('dir.' + d.key)}</h3>
        <p>${t('dir.' + d.key + '.d')}</p>
      </article>`).join('');
  }

  function renderServices() {
    $('#svcList').innerHTML = D.services.map((s, i) => `
      <div class="svc reveal spotlight" style="--d:${i * 60}ms">
        <span class="svc__icon">${icon(s.icon)}</span>
        <div class="svc__body">
          <h3>${t('svc.' + s.key)}</h3>
          <p>${t('svc.' + s.key + '.d')}</p>
        </div>
        <span class="svc__arrow">${icon('arrow')}</span>
      </div>`).join('');
  }

  function renderFilters() {
    const used = new Set(D.doctors.flatMap((d) => d.tags));
    const chips = [['all', t('doc.all'), D.doctors.length]].concat(
      Object.keys(D.tags).filter((k) => used.has(k)).map((k) => [k, D.tags[k][lang], D.doctors.filter((d) => d.tags.includes(k)).length])
    );
    $('#docFilters').innerHTML = chips.map(([k, label, n]) =>
      `<button class="chip${k === activeTag ? ' active' : ''}" data-tag="${k}">${label}<small>${n}</small></button>`).join('');
  }

  function filteredDoctors() {
    const q = query.trim().toLowerCase();
    return D.doctors
      .map((d, i) => ({ ...d, idx: i }))
      .filter((d) => activeTag === 'all' || d.tags.includes(activeTag))
      .filter((d) => !q || [d.name.uz, d.name.ru, d.spec.uz, d.spec.ru].join(' ').toLowerCase().includes(q));
  }

  function doctorAvatar(d, big) {
    const h = HUES[d.idx % HUES.length];
    const inner = d.photo
      ? `<img src="${d.photo}" alt="${d.name[lang]}" loading="lazy" decoding="async" style="object-position:${d.photoPos || '50% 25%'}" />`
      : `<span>${initials(d.name[lang])}</span>`;
    return `<div class="avatar${big ? ' avatar--lg' : ''}${d.photo ? ' avatar--photo' : ''}" style="--h:${h}">
      ${inner}
      <svg class="avatar__ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="47"/></svg>
    </div>`;
  }

  const siteHost = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  function siteLink(d, big) {
    if (!d.site) return '';
    return `<a href="${d.site}" target="_blank" rel="noopener" class="site-link${big ? ' site-link--lg' : ''}">
      <span class="site-link__icon">${icon('globe')}</span>
      <span class="site-link__text"><small>${t('doc.site')}</small><b>${siteHost(d.site)}</b>${big ? `<em>${t('doc.siteSub')}</em>` : ''}</span>
      <span class="site-link__arrow">${icon('external')}</span>
    </a>`;
  }

  function stars(n) {
    if (!n) return '';
    return `<span class="rating">${icon('star', 'i i--star')}<b>${n}</b> ${reviewsLabel(n)}</span>`;
  }

  function renderDoctors(animate) {
    const grid = $('#docGrid');
    const list = filteredDoctors();
    const draw = () => {
      grid.innerHTML = list.map((d, i) => `
        <article class="doc-card spotlight${d.site ? ' doc-card--site' : ''}${animate ? ' pop' : ' reveal'}" style="--d:${(i % 3) * 80}ms" data-idx="${d.idx}">
          <div class="doc-card__top">
            ${doctorAvatar(d)}
            ${d.quals.includes('prof') ? `<span class="doc-card__tag">${icon('award')} ${D.quals.prof[lang].split(' ')[0]}</span>` : ''}
          </div>
          <h3>${d.name[lang]}</h3>
          <p class="doc-card__spec">${d.spec[lang]}</p>
          <div class="doc-card__badges">
            ${d.quals.includes('prof') ? `<span class="pill pill--prof">${icon('award')} ${D.quals.prof[lang].split(' ')[0]}</span>` : ''}
            ${d.quals.filter((q) => q !== 'prof').slice(0, 2).map((q) => `<span class="pill">${D.quals[q][lang]}</span>`).join('')}
          </div>
          <ul class="doc-card__meta">
            ${d.exp ? `<li>${icon('clock')}<span>${t('doc.exp')}: <b>${d.exp} ${yearsLabel(d.exp)}</b></span></li>` : ''}
            <li>${icon(d.kids ? 'baby' : 'users')}<span>${t(d.kids ? 'doc.both' : 'doc.adults')}</span></li>
            <li>${icon('calendar')}<span>${d.schedule ? `${t('hero.daysVal')}, 08:30–17:00` : t('doc.byPhone')}</span></li>
          </ul>
          ${siteLink(d)}
          <div class="doc-card__foot">
            ${stars(d.reviews) || '<span></span>'}
            <div class="doc-card__btns">
              <button class="btn btn--ghost btn--sm" data-doc-more="${d.idx}">${t('doc.more')}</button>
              <button class="btn btn--primary btn--sm" data-doc-book="${d.idx}">${t('doc.book')}</button>
            </div>
          </div>
        </article>`).join('');
      $('#docEmpty').hidden = list.length > 0;
      // On phones show the first few doctors, the rest behind a "show all" button
      const collapse = !docsExpanded && list.length > MOBILE_DOCS;
      grid.classList.toggle('is-collapsed', collapse);
      const more = $('#docMore');
      more.hidden = !collapse;
      more.querySelector('span').textContent = `${t('doc.showAll')} (${list.length})`;

      bindSpotlight(grid);
      if (!animate) observeReveal(grid);
    };

    if (animate && !reduceMotion && grid.children.length) {
      grid.classList.add('is-leaving');
      setTimeout(() => { grid.classList.remove('is-leaving'); draw(); }, 220);
    } else draw();
  }

  function renderVideos() {
    const types = [['all', D.videos.length], ['tips'], ['reviews']].map(([k]) =>
      [k, k === 'all' ? D.videos.length : D.videos.filter((v) => v.type === k).length]);
    $('#vidFilters').innerHTML = types.map(([k, n]) =>
      `<button class="chip${k === vidType ? ' active' : ''}" data-vtype="${k}">${t('vid.' + k)}<small>${n}</small></button>`).join('');

    const list = D.videos.filter((v) => vidType === 'all' || v.type === vidType);
    const track = $('#vidTrack');
    track.innerHTML = list.map((v, i) => `
      <button class="vid-card" data-vid="${v.id}" style="--d:${Math.min(i, 5) * 70}ms" aria-label="${v.title[lang]}">
        <img src="https://i.ytimg.com/vi/${v.id}/oar2.jpg" alt="" draggable="false" loading="lazy" decoding="async"
             onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${v.id}/hqdefault.jpg'" />
        <span class="vid-card__shade"></span>
        <span class="vid-card__badge">${v.type === 'tips' ? icon('stethoscope') : icon('heart')}${t('vid.' + v.type)}</span>
        <span class="vid-card__play"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span>
        <span class="vid-card__title">${v.title[lang]}</span>
      </button>`).join('');
    track.scrollLeft = 0;
    updateVidNav();
  }

  function updateVidNav() {
    const tr = $('#vidTrack');
    $('#vidPrev').disabled = tr.scrollLeft <= 4;
    $('#vidNext').disabled = tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4;
  }

  function openVideo(id) {
    const v = D.videos.find((x) => x.id === id);
    if (!v) return;
    $('#vidPlayer').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1"
      title="${v.title[lang]}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    $('#vidModalTitle').textContent = v.title[lang];
    $('#vidModalLink').href = `https://www.youtube.com/shorts/${id}`;
    $('#vidModal').dataset.current = id;
    openModal('#vidModal');
  }

  function renderBookSelect(selected) {
    const sel = $('#bookDoctor');
    sel.innerHTML = `<option value="">${t('form.anyDoctor')}</option>` +
      D.doctors.map((d, i) => `<option value="${i}">${d.name[lang]} — ${d.spec[lang]}</option>`).join('');
    if (selected !== undefined) sel.value = String(selected);
  }

  function renderAll() {
    applyI18n();
    renderMarquee();
    renderDirections();
    renderServices();
    renderFilters();
    renderDoctors(false);
    renderVideos();
    const cur = $('#bookDoctor').value;
    renderBookSelect(cur || undefined);
    $$('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon); });
    updateOpenStatus();
    const map = $('#mapFrame');
    const mapSrc = map.src.replace(/hl=\w+/, 'hl=' + lang);
    if (map.src !== mapSrc) map.src = mapSrc;
    observeReveal(document);
    bindSpotlight(document);
    bindTilt(document);
    // Re-render open doctor modal in the new language
    const open = $('#docModal.open');
    if (open && open.dataset.idx) fillDoctorModal(+open.dataset.idx);
    const vm = $('#vidModal.open');
    if (vm) {
      const v = D.videos.find((x) => x.id === vm.dataset.current);
      if (v) $('#vidModalTitle').textContent = v.title[lang];
    }
  }

  /* ---------- Doctor modal ---------- */
  function fillDoctorModal(idx) {
    const d = { ...D.doctors[idx], idx };
    const days = t('days');
    $('#docModal').dataset.idx = idx;
    $('#docModalBody').innerHTML = `
      <button class="modal__close" data-close aria-label="Close">×</button>
      <div class="dm">
        <div class="dm__head">
          ${doctorAvatar(d, true)}
          <div>
            <h3>${d.name[lang]}</h3>
            <p class="doc-card__spec">${d.spec[lang]}</p>
            ${stars(d.reviews)}
          </div>
        </div>
        <div class="dm__grid">
          ${d.exp ? `<div class="dm__stat"><b>${d.exp}</b><span>${yearsLabel(d.exp)} — ${t('doc.exp').toLowerCase()}</span></div>` : ''}
          <div class="dm__stat"><b>${icon(d.kids ? 'baby' : 'users')}</b><span>${t(d.kids ? 'doc.both' : 'doc.adults')}</span></div>
        </div>
        ${siteLink(d, true)}
        ${d.quals.length ? `
          <h4>${t('doc.qual')}</h4>
          <ul class="dm__quals">${d.quals.map((q) => `<li>${icon('check')}${D.quals[q][lang]}</li>`).join('')}</ul>` : ''}
        <h4>${t('doc.schedule')}</h4>
        ${d.schedule
          ? `<ul class="dm__sched">${days.map((day) => `<li><span>${day}</span><b>08:30 – 17:00</b></li>`).join('')}</ul>`
          : `<p class="dm__note">${icon('phone')} ${t('doc.byPhone')}</p>`}
        <p class="muted dm__call">${t('doc.callToBook')}:</p>
        <div class="dm__actions">
          <a href="tel:${D.phone}" class="btn btn--ghost btn--block">${icon('phone')} ${D.phoneLabel}</a>
          <button class="btn btn--primary btn--block" data-doc-book="${idx}">${t('doc.book')}</button>
        </div>
      </div>`;
  }

  let lastFocus = null;
  function openModal(id) {
    lastFocus = document.activeElement;
    const m = $(id);
    m.classList.add('open');
    m.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    setTimeout(() => { const f = m.querySelector('input, button'); f && f.focus({ preventScroll: true }); }, 50);
  }
  function closeModal(m) {
    m.classList.remove('open');
    if (m.id === 'vidModal') setTimeout(() => { if (!m.classList.contains('open')) $('#vidPlayer').innerHTML = ''; }, 300);
    m.setAttribute('aria-hidden', 'true');
    if (!$('.modal.open')) document.body.classList.remove('no-scroll');
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }

  function openBooking(docIdx) {
    $('#bookForm').hidden = false;
    $('#bookSuccess').hidden = true;
    renderBookSelect(docIdx);
    const dm = $('#docModal');
    if (dm.classList.contains('open')) closeModal(dm);
    openModal('#bookModal');
  }

  /* ---------- Open / closed badge (Mon–Sat 08:30–17:00, Tashkent time) ---------- */
  function updateOpenStatus() {
    const el = $('#openStatus');
    const now = new Date(Date.now() + (new Date().getTimezoneOffset() + 300) * 60000); // UTC+5
    const mins = now.getHours() * 60 + now.getMinutes();
    const open = now.getDay() !== 0 && mins >= 8 * 60 + 30 && mins < 17 * 60;
    el.textContent = t(open ? 'loc.open' : 'loc.closed');
    el.classList.toggle('is-open', open);
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  /* ---------- Animations ---------- */
  const revealIO = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;

  function observeReveal(scope) {
    $$('.reveal:not(.in)', scope).forEach((el) => {
      if (revealIO && !reduceMotion) revealIO.observe(el); else el.classList.add('in');
    });
  }

  function animateCounter(el) {
    const to = +el.dataset.to;
    if (reduceMotion) { el.textContent = to; return; }
    const dur = 1600, start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { animateCounter(e.target); counterIO.unobserve(e.target); } });
  }, { threshold: 0.6 });
  $$('.counter').forEach((c) => counterIO.observe(c));

  function bindSpotlight(scope) {
    if (!finePointer) return;
    $$('.spotlight:not([data-sp])', scope).forEach((el) => {
      el.dataset.sp = '1';
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  function bindTilt(scope) {
    if (!finePointer || reduceMotion) return;
    $$('.tilt:not([data-tl])', scope).forEach((el) => {
      el.dataset.tl = '1';
      const max = el.classList.contains('dir-card') ? 6 : 10;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--rx', `${-py * max}deg`);
        el.style.setProperty('--ry', `${px * max}deg`);
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  function bindMagnetic() {
    if (!finePointer || reduceMotion) return;
    $$('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  function bindCursorAndParallax() {
    if (!finePointer || reduceMotion) return;
    const glow = $('#cursorGlow');
    const blobs = $$('.blob');
    let tx = innerWidth / 2, ty = innerHeight / 2, cx = tx, cy = ty;
    addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; glow.classList.add('on'); });
    document.addEventListener('pointerleave', () => glow.classList.remove('on'));
    (function loop() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px)`;
      const nx = cx / innerWidth - 0.5, ny = cy / innerHeight - 0.5;
      blobs.forEach((b, i) => {
        const k = (i + 1) * 18;
        b.style.translate = `${nx * k}px ${ny * k}px`;
      });
      requestAnimationFrame(loop);
    })();
  }

  function bindScroll() {
    const header = $('#header');
    const bar = $('#scrollProgress');
    const fab = $('.fab');
    const onScroll = () => {
      const y = scrollY;
      header.classList.toggle('scrolled', y > 20);
      fab.classList.toggle('show', y > 600);
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Active nav link
    const links = $$('.nav a');
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['about', 'directions', 'services', 'doctors', 'videos', 'contact'].forEach((id) => navIO.observe(document.getElementById(id)));
  }

  function heartbeat() {
    const el = $('#bpm');
    setInterval(() => { el.textContent = 68 + Math.round(Math.random() * 8); }, 1800);
  }

  /* ---------- Events ---------- */
  function bindEvents() {
    $$('.lang-switch button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

    $('#themeToggle').addEventListener('click', (e) => {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', e);
    });

    const burger = $('#burger');
    burger.addEventListener('click', () => document.body.classList.toggle('nav-open'));
    // Close the mobile menu when tapping outside the header
    document.addEventListener('click', (e) => {
      if (document.body.classList.contains('nav-open') && !e.target.closest('.header')) document.body.classList.remove('nav-open');
    });

    $('#docMore').addEventListener('click', () => {
      docsExpanded = true;
      $('#docGrid').classList.remove('is-collapsed');
      $('#docMore').hidden = true;
    });
    $$('.nav a').forEach((a) => a.addEventListener('click', () => document.body.classList.remove('nav-open')));

    $('#docFilters').addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b || b.dataset.tag === activeTag) return;
      activeTag = b.dataset.tag;
      $$('.chip', $('#docFilters')).forEach((c) => c.classList.toggle('active', c === b));
      renderDoctors(true);
    });

    let searchTimer;
    $('#docSearch').addEventListener('input', (e) => {
      query = e.target.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => renderDoctors(true), 180);
    });

    // Videos
    $('#vidFilters').addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b || b.dataset.vtype === vidType) return;
      vidType = b.dataset.vtype;
      const track = $('#vidTrack');
      track.classList.add('is-leaving');
      setTimeout(() => { renderVideos(); track.classList.remove('is-leaving'); }, reduceMotion ? 0 : 220);
    });
    const track = $('#vidTrack');
    const step = () => Math.max(track.clientWidth * 0.8, 260);
    $('#vidPrev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    $('#vidNext').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', updateVidNav, { passive: true });
    addEventListener('resize', updateVidNav);

    // Drag to scroll with mouse
    let drag = null;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      drag = { x: e.clientX, left: track.scrollLeft, moved: false };
    });
    addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 5) { drag.moved = true; track.classList.add('dragging'); }
      if (drag.moved) track.scrollLeft = drag.left - dx;
    });
    addEventListener('pointerup', () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      track.classList.remove('dragging');
      // Swallow the click that ends a drag so it doesn't open a video
      if (moved) { track.dataset.dragged = '1'; setTimeout(() => { delete track.dataset.dragged; }, 0); }
    });

    document.addEventListener('click', (e) => {
      const more = e.target.closest('[data-doc-more]');
      if (more) { fillDoctorModal(+more.dataset.docMore); openModal('#docModal'); return; }

      const card = e.target.closest('.doc-card');
      const book = e.target.closest('[data-doc-book]');
      if (book) { openBooking(+book.dataset.docBook); return; }
      if (card && !e.target.closest('button, a')) { fillDoctorModal(+card.dataset.idx); openModal('#docModal'); return; }

      const vid = e.target.closest('.vid-card');
      if (vid) { if (!$('#vidTrack').dataset.dragged) openVideo(vid.dataset.vid); return; }

      if (e.target.closest('[data-open-booking]')) { openBooking(); return; }

      const close = e.target.closest('[data-close]');
      if (close) closeModal(close.closest('.modal'));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') $$('.modal.open').forEach(closeModal);
    });

    // Booking form. NOTE: no backend yet — connect to a Telegram bot / CRM endpoint here.
    $('#bookForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = e.target;
      const name = f.name.value.trim();
      const phoneDigits = f.phone.value.replace(/\D/g, '');
      const okName = name.length >= 2;
      const okPhone = phoneDigits.length >= 12;
      f.name.parentElement.classList.toggle('invalid', !okName);
      f.phone.parentElement.classList.toggle('invalid', !okPhone);
      if (!okName || !okPhone) { toast(t('form.err')); return; }
      f.hidden = true;
      $('#bookSuccess').hidden = false;
      f.reset();
      f.phone.value = '+998 ';
    });

    // Simple phone mask: +998 XX XXX XX XX
    $('#bookForm').phone.addEventListener('input', (e) => {
      let d = e.target.value.replace(/\D/g, '');
      if (d.length <= 3) d = '998';
      else if (!d.startsWith('998')) d = '998' + d;
      d = d.slice(0, 12);
      const p = [d.slice(0, 3), d.slice(3, 5), d.slice(5, 8), d.slice(8, 10), d.slice(10, 12)].filter(Boolean);
      e.target.value = '+' + p.join(' ');
    });
  }

  /* ---------- Init ---------- */
  $('#year').textContent = new Date().getFullYear();
  renderAll();
  bindEvents();
  bindMagnetic();
  bindCursorAndParallax();
  bindScroll();
  heartbeat();

  const hidePreloader = () => setTimeout(() => {
    $('#preloader').classList.add('hide');
    document.body.classList.add('loaded');
  }, reduceMotion ? 0 : 900);
  if (document.readyState === 'complete') hidePreloader();
  else addEventListener('load', hidePreloader);
})();
