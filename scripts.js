/* ============================================================
   SAR-BUD Michał Sarnecki – scripts.js
   Wspólny plik JavaScript dla wszystkich podstron
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. MOBILE NAV TOGGLE ── */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Zamknij menu po kliknięciu w link
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ── 2. AKTYWNY LINK W NAWIGACJI ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── 3. SCROLL TO TOP ── */
  const scrollBtn = document.createElement('button');
  scrollBtn.id = 'scrollTop';
  scrollBtn.setAttribute('aria-label', 'Wróć na górę');
  scrollBtn.innerHTML = '↑';
  document.body.appendChild(scrollBtn);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 4. SCROLL REVEAL ANIMACJE ── */
  const revealElements = document.querySelectorAll(
    '.stat, .service-card, .gallery-item, .service-block, .why-card, .region-tag-item, .preview-item'
  );

  revealElements.forEach(function (el) {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(function (el) {
    observer.observe(el);
  });

  /* ── 5. GALERIA – FILTROWANIE ── */
  window.filterGallery = function (cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    document.querySelectorAll('.gallery-item').forEach(function (item) {
      if (cat === 'all' || item.dataset.cat === cat) {
        item.style.display = '';
        setTimeout(function () { item.style.opacity = '1'; }, 10);
      } else {
        item.style.display = 'none';
      }
    });
  };

  /* ── 6. GALERIA – LIGHTBOX ── */
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (galleryItems.length > 0) {
    // Stwórz overlay lightbox
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
      <div id="lightbox-inner">
        <button id="lightbox-close" aria-label="Zamknij">✕</button>
        <button id="lightbox-prev" aria-label="Poprzednie">‹</button>
        <img id="lightbox-img" src="" alt="" />
        <button id="lightbox-next" aria-label="Następne">›</button>
        <div id="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);

    // Style lightbox inline (żeby działał bez dodatkowego CSS)
    const style = document.createElement('style');
    style.textContent = `
      #lightbox { display:none; position:fixed; inset:0; z-index:500; background:rgba(0,0,0,0.95); align-items:center; justify-content:center; }
      #lightbox.open { display:flex; }
      #lightbox-inner { position:relative; display:flex; align-items:center; gap:16px; max-width:90vw; }
      #lightbox-img { max-width:82vw; max-height:85vh; object-fit:contain; display:block; }
      #lightbox-close { position:fixed; top:20px; right:28px; background:none; border:none; color:#8a8f99; font-size:1.6rem; cursor:pointer; transition:color .2s; z-index:501; }
      #lightbox-close:hover { color:#c9a84c; }
      #lightbox-prev, #lightbox-next { background:none; border:none; color:#8a8f99; font-size:3rem; cursor:pointer; padding:0 8px; transition:color .2s; flex-shrink:0; line-height:1; }
      #lightbox-prev:hover, #lightbox-next:hover { color:#c9a84c; }
      #lightbox-caption { position:fixed; bottom:20px; left:50%; transform:translateX(-50%); font-family:'Barlow Condensed',sans-serif; font-size:0.85rem; letter-spacing:0.15em; color:#8a8f99; text-transform:uppercase; white-space:nowrap; }
    `;
    document.head.appendChild(style);

    let currentIndex = 0;
    let visibleItems = [];

    function getVisibleItems() {
      return Array.from(document.querySelectorAll('.gallery-item'))
        .filter(function (el) { return el.style.display !== 'none'; });
    }

    function openLightbox(index) {
      visibleItems = getVisibleItems();
      currentIndex = index;
      const item = visibleItems[currentIndex];
      const img  = item.querySelector('img');
      const title = item.querySelector('.gallery-info-title');
      if (!img) return;
      document.getElementById('lightbox-img').src = img.src;
      document.getElementById('lightbox-img').alt = img.alt;
      document.getElementById('lightbox-caption').textContent = title ? title.textContent : '';
      document.getElementById('lightbox').classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      document.getElementById('lightbox').classList.remove('open');
      document.body.style.overflow = '';
    }

    function navigate(dir) {
      visibleItems = getVisibleItems();
      currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
      const item  = visibleItems[currentIndex];
      const img   = item.querySelector('img');
      const title = item.querySelector('.gallery-info-title');
      if (!img) return;
      document.getElementById('lightbox-img').src = img.src;
      document.getElementById('lightbox-img').alt = img.alt;
      document.getElementById('lightbox-caption').textContent = title ? title.textContent : '';
    }

    galleryItems.forEach(function (item, i) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', function () { openLightbox(i); });
    });

    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev').addEventListener('click', function () { navigate(-1); });
    document.getElementById('lightbox-next').addEventListener('click', function () { navigate(1); });

    document.getElementById('lightbox').addEventListener('click', function (e) {
      if (e.target === this) closeLightbox();
    });

    // Klawiatura
    document.addEventListener('keydown', function (e) {
      if (!document.getElementById('lightbox').classList.contains('open')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowRight')  navigate(1);
      if (e.key === 'ArrowLeft')   navigate(-1);
    });
  }

  /* ── 7. FORMULARZ KONTAKTOWY ── */
  window.sendForm = function () {
    const imie = document.getElementById('imie');
    const tel  = document.getElementById('tel');
    const msg  = document.getElementById('successMsg');

    if (!imie || !tel) return;

    if (!imie.value.trim()) {
      imie.style.borderColor = '#e05555';
      imie.focus();
      return;
    }
    if (!tel.value.trim()) {
      tel.style.borderColor = '#e05555';
      tel.focus();
      return;
    }

    // Reset błędów
    imie.style.borderColor = '';
    tel.style.borderColor  = '';

    if (msg) {
      msg.style.display = 'block';
      msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Tutaj możesz podpiąć Formspree lub własne API:
    // fetch('https://formspree.io/f/TWOJ_ID', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     imie:     imie.value,
    //     telefon:  tel.value,
    //     email:    document.getElementById('email')?.value,
    //     usluga:   document.getElementById('usluga')?.value,
    //     wiadomosc: document.getElementById('wiadomosc')?.value,
    //   })
    // });
  };

  /* ── 8. LAZY LOAD ZDJĘĆ ── */
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img[data-src]').forEach(function (img) {
      imgObserver.observe(img);
    });
  }

});
