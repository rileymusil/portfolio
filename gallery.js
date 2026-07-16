/* ==========================================================================
   gallery.js
   Shared front-end renderer: session cover grid -> mini gallery modal ->
   full-size lightbox. Reads its content from a JSON file (see
   creative-data.json / event-data.json / portraits-data.json) so the pages
   themselves never need to be hand-edited when photos change.

   Usage (near the end of the page): initGallery('portraits-data.json');
   ========================================================================== */

function initGallery(dataUrl) {
    const grid = document.getElementById('sessionGrid');
    if (!grid) return;

    const modal          = document.getElementById('sessionModal');
    const modalBackdrop  = document.getElementById('sessionModalBackdrop');
    const modalClose     = document.getElementById('sessionModalClose');
    const modalTitle     = document.getElementById('sessionModalTitle');
    const modalDesc      = document.getElementById('sessionModalDesc');
    const thumbGrid      = document.getElementById('sessionThumbGrid');

    const lightbox   = document.getElementById('lightbox');
    const lbBackdrop = document.getElementById('lbBackdrop');
    const lbImg       = document.getElementById('lbImg');
    const lbCounter   = document.getElementById('lbCounter');
    const lbPrev      = document.getElementById('lbPrev');
    const lbNext      = document.getElementById('lbNext');
    const lbClose     = document.getElementById('lbClose');

    let activePhotos = [];
    let current = 0;

    fetch(dataUrl, { cache: 'no-store' })
        .then(r => { if (!r.ok) throw new Error('Failed to load ' + dataUrl); return r.json(); })
        .then(data => renderGrid(data.sessions || []))
        .catch(() => {
            grid.innerHTML = '<p class="gallery-empty">This gallery is being updated &mdash; please check back soon.</p>';
        });

    function renderGrid(sessions) {
        if (!sessions.length) {
            grid.innerHTML = '<p class="gallery-empty">No sessions have been added yet.</p>';
            return;
        }
        grid.innerHTML = '';
        sessions.forEach(session => {
            const count = (session.photos || []).length;
            const card = document.createElement('div');
            card.className = 'session-card';
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', 'Open ' + session.title + ' gallery');
            card.innerHTML =
                '<img src="' + escapeAttr(session.cover) + '" alt="' + escapeAttr(session.title) + '" loading="lazy">' +
                '<div class="card-caption">' +
                    '<h3>' + escapeHtml(session.title) + '</h3>' +
                    '<div class="card-meta">' + count + ' photo' + (count === 1 ? '' : 's') + '</div>' +
                '</div>';
            card.addEventListener('click', () => openSession(session));
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSession(session); }
            });
            grid.appendChild(card);
        });
    }

    function openSession(session) {
        modalTitle.textContent = session.title || '';
        modalDesc.textContent = session.description || '';
        activePhotos = session.photos || [];

        thumbGrid.innerHTML = '';
        activePhotos.forEach((src, i) => {
            const thumb = document.createElement('div');
            thumb.className = 'session-thumb';
            thumb.setAttribute('tabindex', '0');
            thumb.setAttribute('role', 'button');
            thumb.innerHTML = '<img src="' + escapeAttr(src) + '" alt="' + escapeAttr(session.title) + ' photo ' + (i + 1) + '" loading="lazy">';
            thumb.addEventListener('click', () => openLightbox(i));
            thumb.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
            });
            thumbGrid.appendChild(thumb);
        });

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSession() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openLightbox(index) {
        current = (index + activePhotos.length) % activePhotos.length;
        lbImg.src = activePhotos[current];
        lbImg.alt = '';
        lbCounter.textContent = (current + 1) + ' / ' + activePhotos.length;
        lightbox.classList.add('active');
    }

    function navigate(dir) {
        current = (current + dir + activePhotos.length) % activePhotos.length;
        lbImg.classList.add('switching');
        setTimeout(() => {
            lbImg.src = activePhotos[current];
            lbImg.classList.remove('switching');
            lbCounter.textContent = (current + 1) + ' / ' + activePhotos.length;
        }, 180);
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
    }

    modalClose.addEventListener('click', closeSession);
    modalBackdrop.addEventListener('click', closeSession);
    lbPrev.addEventListener('click', () => navigate(-1));
    lbNext.addEventListener('click', () => navigate(1));
    lbClose.addEventListener('click', closeLightbox);
    lbBackdrop.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', e => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        } else if (modal.classList.contains('active')) {
            if (e.key === 'Escape') closeSession();
        }
    });

    function escapeHtml(str) {
        return String(str == null ? '' : str).replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
    }
    function escapeAttr(str) { return escapeHtml(str); }
}
