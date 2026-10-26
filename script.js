/* ============================================================
   DIRECTORATE OF PROCUREMENT — kiosk app logic
   ============================================================ */

(function () {
  'use strict';

  var STAGE_W = 1920, STAGE_H = 1080;
  var IDLE_TIMEOUT_MS = 100000; // 100s of no interaction -> return to attract
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Chronicle auto-scroll: a slow drift through the roll of directors that
  // pauses as soon as a visitor touches the track and picks up again after
  // a quiet spell, bouncing back and forth between the two ends.
  var AUTO_SCROLL_SPEED = 0.45; // px per animation frame (~27px/s)
  var AUTO_SCROLL_START_DELAY = 1800; // ms pause before the scroll begins, and at each end
  var AUTO_SCROLL_RESUME_DELAY = 10000; // ms of no manual scroll before auto-scroll resumes
  var AUTO_SCROLL_END_EPSILON = 2; // px tolerance for "reached the end"

  var DIRECTORS = DP_CONTENT.directors;
  var CURRENT_INDEX = findCurrentIndex();

  var state = {
    screen: 'attract',
    briefIndex: 0,
    profileIndex: null
  };

  var el = {}; // populated in init()
  var idleTimer = null;
  var scrollTimer = null;
  var scrollRaf = null;
  var scrollDir = 1; // 1 = scrolling right, -1 = scrolling left
  var scrollPos = 0; // fractional auto-scroll position

  /* ---------------- helpers ---------------- */
  function t(key) {
    var v = DP_CONTENT.ui[key];
    return v !== undefined ? v : key;
  }

  function findCurrentIndex() {
    for (var i = DIRECTORS.length - 1; i >= 0; i--) {
      if (!DIRECTORS[i].to) return i;
    }
    return DIRECTORS.length - 1;
  }

  function parseDate(iso) {
    var p = iso.split('-');
    return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
  }

  function today() {
    var n = new Date();
    return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()));
  }

  function endDate(d) { return d.to ? parseDate(d.to) : today(); }

  function fmtLong(date) {
    return date.getUTCDate() + ' ' + MONTHS[date.getUTCMonth()] + ' ' + date.getUTCFullYear();
  }

  function fmtShort(date) {
    return MONTHS[date.getUTCMonth()].slice(0, 3) + ' ' + date.getUTCFullYear();
  }

  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  function fmtDuration(from, to) {
    var y = to.getUTCFullYear() - from.getUTCFullYear();
    var m = to.getUTCMonth() - from.getUTCMonth();
    var d = to.getUTCDate() - from.getUTCDate();
    if (d < 0) {
      m--;
      d += new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), 0)).getUTCDate();
    }
    if (m < 0) { y--; m += 12; }
    var parts = [];
    if (y) parts.push(plural(y, 'year'));
    if (m) parts.push(plural(m, 'month'));
    if (!parts.length) parts.push(plural(d, 'day'));
    return parts.join(', ');
  }

  function ordinal(n) {
    var s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function fullName(d) { return d.rank + ' ' + d.name; }

  function appointmentTitle(d) {
    return (d.acting ? t('acting') + ' ' : '') + t('directorTitle');
  }

  function tenureRange(d) {
    return fmtLong(parseDate(d.from)) + ' — ' + (d.to ? fmtLong(parseDate(d.to)) : t('present'));
  }

  function make(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  function img(src, alt) {
    var i = document.createElement('img');
    i.src = src; i.alt = alt || ''; i.draggable = false;
    return i;
  }

  function restartAnimation(node, cls) {
    node.classList.remove('enter', 'enter-next', 'enter-prev');
    void node.offsetWidth; // force reflow so the animation replays
    if (cls) node.classList.add(cls);
  }

  /* ---------------- stage scaling ---------------- */
  function scaleStage() {
    var vw = window.innerWidth, vh = window.innerHeight;
    // Fit inside the viewport (never crop) — a true 16:9 screen fills
    // edge-to-edge; anything else letterboxes onto a matching colour.
    var scale = Math.min(vw / STAGE_W, vh / STAGE_H);
    el.stage.style.transform = 'scale(' + scale + ')';
  }

  function applyStaticI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      node.textContent = t(node.getAttribute('data-i18n'));
    });
  }

  /* ---------------- navigation ---------------- */
  function showScreen(id) {
    closeProfile();
    stopAutoScroll();
    state.screen = id;
    Object.keys(el.screens).forEach(function (key) {
      el.screens[key].classList.toggle('active', key === id);
    });
    el.topbar.classList.toggle('hidden', id === 'attract');

    if (id === 'brief') renderBriefPage(null);
    if (id === 'chronicle') enterChronicle();
    resetIdleTimer();
  }

  function goHome() { showScreen('home'); }

  /* ---------------- attract ---------------- */
  function buildAttractWall() {
    var rows = ['a', 'b', 'c'];
    rows.forEach(function (r, ri) {
      var row = make('div', 'wall-row wall-row--' + r);
      // Offset each row so the same face never lines up vertically, then
      // repeat the set so the -50% keyframe loops seamlessly.
      var order = DIRECTORS.map(function (_, i) { return DIRECTORS[(i + ri * 4) % DIRECTORS.length]; });
      order.concat(order).forEach(function (d) {
        var tile = make('div', 'wall-tile');
        tile.appendChild(img(d.photo));
        row.appendChild(tile);
      });
      el.attractWall.appendChild(row);
    });

    var first = parseDate(DIRECTORS[0].from).getUTCFullYear();
    el.attractYears.textContent = first + ' — ' + t('present').toUpperCase();
  }

  /* ---------------- home ---------------- */
  function buildHome() {
    var cur = DIRECTORS[CURRENT_INDEX];
    var picks = [DIRECTORS[0], DIRECTORS[Math.floor(CURRENT_INDEX / 2)], cur, DIRECTORS[Math.max(0, CURRENT_INDEX - 1)]];
    picks.forEach(function (d) {
      var c = make('span', 'menu-stack-card');
      c.appendChild(img(d.photo));
      el.menuStack.appendChild(c);
    });
    el.menuDirectorPhoto.src = cur.photo;
  }

  /* ---------------- brief ---------------- */
  function buildBrief() {
    DP_CONTENT.brief.forEach(function (page, i) {
      var li = make('li');
      var b = make('button', null, '<span>' + pad2(i + 1) + '</span>');
      b.appendChild(document.createTextNode(page.heading));
      b.addEventListener('click', function () { renderBriefPage(i); });
      li.appendChild(b);
      el.briefIndex.appendChild(li);
      el.briefProgress.appendChild(make('span'));
    });
    el.briefPrev.addEventListener('click', function () { renderBriefPage(state.briefIndex - 1); });
    el.briefNext.addEventListener('click', function () { renderBriefPage(state.briefIndex + 1); });
    addSwipe(el.screens.brief, function (dir) { renderBriefPage(state.briefIndex + dir); });
  }

  function renderBriefPage(i) {
    var pages = DP_CONTENT.brief;
    if (i === null) i = 0;
    if (i < 0 || i >= pages.length) return;
    state.briefIndex = i;
    el.briefPageNum.textContent = pad2(i + 1);
    el.briefHeading.textContent = pages[i].heading;
    el.briefText.textContent = pages[i].text;
    restartAnimation(el.briefPage, 'enter');
    Array.prototype.forEach.call(el.briefIndex.children, function (li, n) { li.classList.toggle('active', n === i); });
    Array.prototype.forEach.call(el.briefProgress.children, function (s, n) { s.classList.toggle('active', n === i); });
    el.briefPrev.disabled = i === 0;
    el.briefNext.disabled = i === pages.length - 1;
  }

  /* ---------------- chronicle ---------------- */
  function buildChronicle() {
    var first = parseDate(DIRECTORS[0].from).getUTCFullYear();
    el.chronYears.textContent = first + ' — ' + t('present');
    el.chronCount.textContent = DIRECTORS.length + ' Directors';

    var rail = make('div', 'chron-rail');
    DIRECTORS.forEach(function (d, i) {
      var isCurrent = i === CURRENT_INDEX;
      var card = make('button', 'dcard' + (isCurrent ? ' dcard--current' : ''));
      card.style.animationDelay = (i * 0.05) + 's';
      card.setAttribute('aria-label', fullName(d));

      var node = make('span', 'dcard-node');
      node.appendChild(make('span', 'dcard-dot'));
      node.appendChild(make('span', 'dcard-num', pad2(i + 1)));
      card.appendChild(node);

      var frame = make('span', 'dcard-frame');
      frame.appendChild(img(d.photo, fullName(d)));
      card.appendChild(frame);

      var body = make('span', 'dcard-body');
      var tags = make('span', 'dcard-tags');
      if (isCurrent) tags.appendChild(make('span', 'tag tag--incumbent', t('incumbent')));
      if (d.acting) tags.appendChild(make('span', 'tag', t('acting')));
      body.appendChild(tags);
      body.appendChild(make('span', 'dcard-rank', d.rankShort));
      body.appendChild(make('span', 'dcard-name', d.name));
      body.appendChild(make('span', 'dcard-dates',
        fmtShort(parseDate(d.from)) + ' — ' + (d.to ? fmtShort(parseDate(d.to)) : t('present'))));
      card.appendChild(body);

      card.addEventListener('click', function () {
        if (dragMoved) return;
        openProfile(i);
      });
      rail.appendChild(card);
    });
    el.chronTrack.appendChild(rail);
    el.cards = rail.children;

    buildRibbon();
    enableDragScroll(el.chronTrack);
    el.chronTrack.addEventListener('scroll', syncFocus, { passive: true });
  }

  function buildRibbon() {
    var start = parseDate(DIRECTORS[0].from);
    var end = endDate(DIRECTORS[CURRENT_INDEX]);
    var span = end - start;

    DIRECTORS.forEach(function (d, i) {
      var days = Math.max(1, (endDate(d) - parseDate(d.from)) / 864e5);
      var seg = make('button', 'ribbon-seg' + (d.acting ? ' ribbon-seg--acting' : '') + (i === CURRENT_INDEX ? ' ribbon-seg--current' : ''));
      seg.style.flexGrow = days;
      seg.setAttribute('aria-label', fullName(d));
      if (days > 120) seg.appendChild(make('span', null, pad2(i + 1)));
      seg.addEventListener('click', function () {
        stopAutoScroll();
        scrollToCard(i);
        scheduleAutoScroll(AUTO_SCROLL_RESUME_DELAY);
      });
      el.ribbonBar.appendChild(seg);
    });

    for (var y = start.getUTCFullYear() + 1; y <= end.getUTCFullYear(); y++) {
      var pos = (Date.UTC(y, 0, 1) - start) / span;
      var tick = make('span', 'ribbon-year', String(y));
      tick.style.left = (pos * 100) + '%';
      el.ribbonYears.appendChild(tick);
    }
  }

  function scrollToCard(i) {
    var card = el.cards[i];
    var target = card.offsetLeft + card.offsetWidth / 2 - el.chronTrack.clientWidth / 2;
    el.chronTrack.scrollTo({ left: target, behavior: 'smooth' });
  }

  function syncFocus() {
    var track = el.chronTrack;
    // Slide the focus point across the viewport with scroll progress, so the
    // first and last cards can be focused even though they never reach the middle.
    var max = track.scrollWidth - track.clientWidth;
    var progress = max > 0 ? track.scrollLeft / max : 0.5;
    var center = track.scrollLeft + track.clientWidth * (0.1 + 0.8 * progress);
    var best = 0, bestDist = Infinity;
    for (var i = 0; i < el.cards.length; i++) {
      var c = el.cards[i];
      var dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
      if (dist < bestDist) { bestDist = dist; best = i; }
    }
    for (var j = 0; j < el.cards.length; j++) {
      el.cards[j].classList.toggle('is-focus', j === best);
      el.ribbonBar.children[j].classList.toggle('is-focus', j === best);
    }
  }

  function enterChronicle() {
    el.chronTrack.scrollLeft = 0;
    scrollPos = 0;
    scrollDir = 1;
    syncFocus();
    scheduleAutoScroll(AUTO_SCROLL_START_DELAY);
  }

  function scheduleAutoScroll(delay) {
    stopAutoScroll();
    scrollTimer = setTimeout(function () {
      scrollTimer = null;
      scrollRaf = requestAnimationFrame(stepAutoScroll);
    }, delay);
  }

  function stopAutoScroll() {
    if (scrollTimer) { clearTimeout(scrollTimer); scrollTimer = null; }
    if (scrollRaf) { cancelAnimationFrame(scrollRaf); scrollRaf = null; }
  }

  function stepAutoScroll() {
    var track = el.chronTrack;
    var max = track.scrollWidth - track.clientWidth;
    if (max <= 0) return;
    // scrollLeft snaps to whole pixels, so accumulate the sub-pixel steps
    // separately (re-syncing if a visitor has moved the track since).
    if (Math.abs(scrollPos - track.scrollLeft) >= 1) scrollPos = track.scrollLeft;
    scrollPos = Math.max(0, Math.min(max, scrollPos + AUTO_SCROLL_SPEED * scrollDir));
    track.scrollLeft = scrollPos;
    var atEnd = scrollDir > 0 ? scrollPos >= max - AUTO_SCROLL_END_EPSILON : scrollPos <= AUTO_SCROLL_END_EPSILON;
    if (atEnd) {
      scrollDir = -scrollDir;
      scheduleAutoScroll(AUTO_SCROLL_START_DELAY);
      return;
    }
    scrollRaf = requestAnimationFrame(stepAutoScroll);
  }

  // Touch screens scroll the track natively; this adds the same feel for a
  // mouse, and tells the auto-scroll to step aside while someone is browsing.
  var dragMoved = false;
  function enableDragScroll(track) {
    var startX = 0, startLeft = 0, dragging = false;
    track.addEventListener('pointerdown', function (e) {
      stopAutoScroll();
      dragMoved = false;
      if (e.pointerType !== 'mouse') return;
      dragging = true; startX = e.clientX; startLeft = track.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = (e.clientX - startX) / currentScale();
      if (Math.abs(dx) > 8) dragMoved = true;
      track.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', function () {
      dragging = false;
      if (state.screen === 'chronicle' && state.profileIndex === null) scheduleAutoScroll(AUTO_SCROLL_RESUME_DELAY);
    });
    track.addEventListener('touchmove', function () { dragMoved = true; }, { passive: true });
    track.addEventListener('wheel', function (e) {
      stopAutoScroll();
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) track.scrollLeft += e.deltaY;
      scheduleAutoScroll(AUTO_SCROLL_RESUME_DELAY);
    }, { passive: true });
  }

  function currentScale() {
    var m = /scale\(([\d.]+)\)/.exec(el.stage.style.transform);
    return m ? parseFloat(m[1]) : 1;
  }

  /* ---------------- current director ---------------- */
  function buildDirector() {
    var d = DIRECTORS[CURRENT_INDEX];
    el.directorPhoto.src = d.photo;
    el.directorPhoto.alt = fullName(d);
    el.directorRank.textContent = d.rank;
    el.directorName.textContent = d.name;
    el.directorPost.textContent = d.postNominals || '';
    el.directorAssumed.textContent = fmtLong(parseDate(d.from));
    el.directorInoffice.textContent = fmtDuration(parseDate(d.from), today());
    el.directorOrdinal.textContent = ordinal(CURRENT_INDEX + 1);

    if (CURRENT_INDEX > 0) {
      var prev = DIRECTORS[CURRENT_INDEX - 1];
      el.directorPredecessor.appendChild(chipContent(prev, t('precededBy')));
      el.directorPredecessor.addEventListener('click', function () { openProfile(CURRENT_INDEX - 1); });
    }
    el.directorChronicle.addEventListener('click', function () { showScreen('chronicle'); });
  }

  function chipContent(d, label) {
    var frag = document.createDocumentFragment();
    var thumb = make('span', 'chip-thumb');
    thumb.appendChild(img(d.photo));
    frag.appendChild(thumb);
    var text = make('span', 'chip-text');
    text.appendChild(make('span', 'chip-label', label));
    text.appendChild(make('span', 'chip-name', d.rankShort + ' ' + d.name));
    frag.appendChild(text);
    return frag;
  }

  /* ---------------- profile overlay ---------------- */
  function openProfile(i, direction) {
    if (i < 0 || i >= DIRECTORS.length) return;
    stopAutoScroll();
    var d = DIRECTORS[i];
    var isCurrent = i === CURRENT_INDEX;
    state.profileIndex = i;

    el.profileOrdinal.textContent = pad2(i + 1);
    el.profilePhoto.src = d.photo;
    el.profilePhoto.alt = fullName(d);
    el.profileKicker.textContent = t('directorNo') + ' ' + (i + 1) + ' ' + t('of') + ' ' + DIRECTORS.length;
    el.profileTag.textContent = isCurrent ? t('incumbent') : (d.acting ? t('acting') : '');
    el.profileTag.className = 'tag' + (isCurrent ? ' tag--incumbent' : '');
    el.profileRank.textContent = d.rank;
    el.profileName.textContent = d.name;
    el.profilePost.textContent = d.postNominals || '';
    el.profileAppt.textContent = appointmentTitle(d);
    el.profileSvc.textContent = d.serviceNo || '—';
    el.profileTenure.textContent = tenureRange(d);
    el.profileDuration.textContent = fmtDuration(parseDate(d.from), endDate(d));

    el.profileSuccession.innerHTML = '';
    if (i > 0) el.profileSuccession.appendChild(successionChip(i - 1, t('precededBy'), -1));
    if (i < DIRECTORS.length - 1) el.profileSuccession.appendChild(successionChip(i + 1, t('succeededBy'), 1));

    el.profilePrev.disabled = i === 0;
    el.profileNext.disabled = i === DIRECTORS.length - 1;

    var wasOpen = !el.profile.classList.contains('hidden');
    el.profile.classList.remove('hidden');
    el.profile.setAttribute('aria-hidden', 'false');
    restartAnimation(el.profileBody, wasOpen ? (direction < 0 ? 'enter-prev' : 'enter-next') : null);

    if (state.screen === 'chronicle') scrollToCard(i);
    resetIdleTimer();
  }

  function successionChip(i, label, dir) {
    var b = make('button', 'chip-btn');
    b.appendChild(chipContent(DIRECTORS[i], label));
    b.addEventListener('click', function () { openProfile(i, dir); });
    return b;
  }

  function closeProfile() {
    if (state.profileIndex === null) return;
    state.profileIndex = null;
    el.profile.classList.add('hidden');
    el.profile.setAttribute('aria-hidden', 'true');
    if (state.screen === 'chronicle') scheduleAutoScroll(AUTO_SCROLL_RESUME_DELAY);
  }

  /* ---------------- swipe ---------------- */
  // dir is +1 for a swipe towards the next item (finger moves left).
  function addSwipe(node, onSwipe) {
    var x0 = null, y0 = null;
    node.addEventListener('pointerdown', function (e) { x0 = e.clientX; y0 = e.clientY; });
    node.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = (e.clientX - x0) / currentScale(), dy = (e.clientY - y0) / currentScale();
      x0 = null;
      if (Math.abs(dx) > 90 && Math.abs(dx) > Math.abs(dy) * 1.5) onSwipe(dx < 0 ? 1 : -1);
    });
  }

  /* ---------------- idle ---------------- */
  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = null;
    if (state.screen === 'attract') return;
    idleTimer = setTimeout(triggerIdleReset, IDLE_TIMEOUT_MS);
  }

  function triggerIdleReset() {
    el.idleOverlay.classList.remove('hidden');
    setTimeout(function () {
      el.idleOverlay.classList.add('hidden');
      showScreen('attract');
    }, 1600);
  }

  /* ---------------- init ---------------- */
  function init() {
    el.stage = document.getElementById('stage');
    el.topbar = document.getElementById('topbar');
    el.screens = {
      attract: document.getElementById('screen-attract'),
      home: document.getElementById('screen-home'),
      brief: document.getElementById('screen-brief'),
      chronicle: document.getElementById('screen-chronicle'),
      director: document.getElementById('screen-director')
    };
    el.attractWall = document.getElementById('attract-wall');
    el.attractYears = document.getElementById('attract-years');
    el.menuStack = document.getElementById('menu-stack');
    el.menuDirectorPhoto = document.getElementById('menu-director-photo');

    el.briefIndex = document.getElementById('brief-index');
    el.briefPage = document.getElementById('brief-page');
    el.briefPageNum = document.getElementById('brief-page-num');
    el.briefHeading = document.getElementById('brief-heading');
    el.briefText = document.getElementById('brief-text');
    el.briefProgress = document.getElementById('brief-progress');
    el.briefPrev = document.getElementById('brief-prev');
    el.briefNext = document.getElementById('brief-next');

    el.chronYears = document.getElementById('chron-years');
    el.chronCount = document.getElementById('chron-count');
    el.chronTrack = document.getElementById('chron-track');
    el.ribbonBar = document.getElementById('ribbon-bar');
    el.ribbonYears = document.getElementById('ribbon-years');

    el.directorPhoto = document.getElementById('director-photo');
    el.directorRank = document.getElementById('director-rank');
    el.directorName = document.getElementById('director-name');
    el.directorPost = document.getElementById('director-post');
    el.directorAssumed = document.getElementById('director-assumed');
    el.directorInoffice = document.getElementById('director-inoffice');
    el.directorOrdinal = document.getElementById('director-ordinal');
    el.directorPredecessor = document.getElementById('director-predecessor');
    el.directorChronicle = document.getElementById('director-chronicle');

    el.profile = document.getElementById('profile');
    el.profileBody = document.getElementById('profile-body');
    el.profileOrdinal = document.getElementById('profile-ordinal');
    el.profilePhoto = document.getElementById('profile-photo');
    el.profileKicker = document.getElementById('profile-kicker');
    el.profileTag = document.getElementById('profile-tag');
    el.profileRank = document.getElementById('profile-rank');
    el.profileName = document.getElementById('profile-name');
    el.profilePost = document.getElementById('profile-post');
    el.profileAppt = document.getElementById('profile-appt');
    el.profileSvc = document.getElementById('profile-svc');
    el.profileTenure = document.getElementById('profile-tenure');
    el.profileDuration = document.getElementById('profile-duration');
    el.profileSuccession = document.getElementById('profile-succession');
    el.profilePrev = document.getElementById('profile-prev');
    el.profileNext = document.getElementById('profile-next');
    el.idleOverlay = document.getElementById('idle-overlay');

    applyStaticI18n();
    buildAttractWall();
    buildHome();
    buildBrief();
    buildChronicle();
    buildDirector();

    // Any touch on the welcome screen begins — the button is just the cue.
    el.screens.attract.addEventListener('click', goHome);
    document.getElementById('btn-home').addEventListener('click', goHome);
    document.getElementById('btn-close').addEventListener('click', function () { window.close(); });
    document.querySelectorAll('[data-nav]').forEach(function (btn) {
      btn.addEventListener('click', function () { showScreen(btn.getAttribute('data-nav')); });
    });

    document.getElementById('profile-close').addEventListener('click', closeProfile);
    document.getElementById('profile-backdrop').addEventListener('click', closeProfile);
    el.profilePrev.addEventListener('click', function () { openProfile(state.profileIndex - 1, -1); });
    el.profileNext.addEventListener('click', function () { openProfile(state.profileIndex + 1, 1); });
    addSwipe(document.getElementById('profile-panel'), function (dir) { openProfile(state.profileIndex + dir, dir); });

    document.addEventListener('keydown', function (e) {
      if (state.profileIndex !== null) {
        if (e.key === 'Escape') closeProfile();
        if (e.key === 'ArrowLeft') openProfile(state.profileIndex - 1, -1);
        if (e.key === 'ArrowRight') openProfile(state.profileIndex + 1, 1);
      } else if (state.screen === 'brief') {
        if (e.key === 'ArrowLeft') renderBriefPage(state.briefIndex - 1);
        if (e.key === 'ArrowRight') renderBriefPage(state.briefIndex + 1);
      }
    });

    ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(function (evt) {
      document.addEventListener(evt, resetIdleTimer, { passive: true });
    });
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    window.addEventListener('resize', scaleStage);
    scaleStage();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
