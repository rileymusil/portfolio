/* ==========================================================================
   admin.js
   Shared logic for the gallery management pages (creativeback.html,
   eventback.html, portraitsback.html).

   IMPORTANT — read this before relying on the password gate:
   This is a plain static HTML site with no server, so there is no way to do
   *real* login security here. The page stores a SHA-256 hash rather than the
   password itself, so the password is no longer readable in the page source —
   but the check still runs entirely in the visitor's browser and can be
   stepped over with dev tools. Treat it as a "keep casual visitors out"
   curtain, not a lock. Don't reuse a password here that protects anything else.

   To change the password, generate a new hash and paste it into the
   passwordHash field of each *back.html page. In the browser console:
       await (async p => {
         const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(p));
         return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,'0')).join('');
       })('your-new-password')

   IMPORTANT — how "upload" actually works here:
   A static site can't accept file uploads from a browser and save them on
   the server — there's no backend to receive them. So this page lets you:
     1) Pick photos from your computer to preview them and auto-fill the
        correct filename (this preview is 100% local — nothing is sent
        anywhere).
     2) Build/edit the list of sessions, covers, and descriptions.
     3) Export an updated JSON data file.
   You then upload BOTH the actual photo files and the exported JSON file
   to your website's hosting (e.g. via FTP or your host's file manager),
   using the exact filenames you entered here.
   ========================================================================== */

function initAdmin(config) {
    const category  = config.category;
    const dataFile  = config.dataFile;
    const pageTitle = config.pageTitle;
    const livePage  = config.livePage;
    const passwordHash = config.passwordHash;
    const draftKey  = 'admin_draft_' + category;
    const unlockKey = 'admin_unlocked_' + category;

    const gate       = document.getElementById('adminGate');
    const gateInput  = document.getElementById('adminPassword');
    const gateBtn    = document.getElementById('adminGateBtn');
    const gateError  = document.getElementById('adminGateError');
    const app        = document.getElementById('adminApp');
    const noteBar    = document.getElementById('draftNote');
    const reloadBtn  = document.getElementById('reloadLiveBtn');

    const sessionList = document.getElementById('sessionList');
    const addBtn       = document.getElementById('addSessionBtn');

    const formOverlay  = document.getElementById('formOverlay');
    const form          = document.getElementById('sessionForm');
    const formTitleEl   = document.getElementById('formTitle');
    const titleInput     = document.getElementById('fieldTitle');
    const descInput       = document.getElementById('fieldDesc');
    const coverInput      = document.getElementById('fieldCover');
    const coverPreview     = document.getElementById('coverPreview');
    const coverFile        = document.getElementById('coverFile');
    const photoRows         = document.getElementById('photoRows');
    const addPhotoRowBtn     = document.getElementById('addPhotoRowBtn');
    const photoFile           = document.getElementById('photoFile');
    const cancelBtn            = document.getElementById('cancelFormBtn');

    const exportBtn  = document.getElementById('exportBtn');
    const exportArea = document.getElementById('exportArea');

    let sessions = [];
    let editingId = null;
    let currentPhotos = []; // [{ filename, preview }]

    /* ---------- Password gate ---------- */
    function unlock() {
        gate.style.display = 'none';
        app.classList.add('unlocked');
    }
    if (sessionStorage.getItem(unlockKey) === 'yes') unlock();

    gateBtn.addEventListener('click', tryUnlock);
    gateInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });

    /* The page stores only a SHA-256 hash, so the password itself is not sitting
       in the source for anyone who hits View Source. Note this hides the
       password, it does not make the gate secure — the check still runs in the
       visitor's browser and can still be stepped over with dev tools. */
    async function sha256Hex(text) {
        const bytes = new TextEncoder().encode(text);
        const digest = await crypto.subtle.digest('SHA-256', bytes);
        return Array.from(new Uint8Array(digest))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
    }

    async function tryUnlock() {
        if (!window.crypto || !crypto.subtle) {
            /* crypto.subtle only exists in a secure context (https or localhost). */
            gateError.textContent = 'This page must be opened over https to sign in.';
            return;
        }
        let entered;
        try {
            entered = await sha256Hex(gateInput.value);
        } catch (e) {
            gateError.textContent = 'Could not check the password on this browser.';
            return;
        }
        if (entered === passwordHash) {
            sessionStorage.setItem(unlockKey, 'yes');
            gateError.textContent = '';
            gateInput.value = '';
            unlock();
        } else {
            gateError.textContent = 'Incorrect password. Try again.';
        }
    }

    /* ---------- Load data: local draft first, else the live JSON file ---------- */
    const draft = localStorage.getItem(draftKey);
    if (draft) {
        try {
            sessions = JSON.parse(draft).sessions || [];
            showNote(true);
            renderList();
        } catch (e) {
            loadLive();
        }
    } else {
        loadLive();
    }

    function loadLive() {
        fetch(dataFile, { cache: 'no-store' })
            .then(r => r.ok ? r.json() : { sessions: [] })
            .then(data => { sessions = data.sessions || []; renderList(); })
            .catch(() => { sessions = []; renderList(); });
    }

    function showNote(isDraft) { noteBar.style.display = isDraft ? 'flex' : 'none'; }

    reloadBtn.addEventListener('click', () => {
        if (!confirm('Discard your local unsaved changes and reload from the live data file?')) return;
        localStorage.removeItem(draftKey);
        showNote(false);
        loadLive();
    });

    function saveDraft() {
        localStorage.setItem(draftKey, JSON.stringify({ pageTitle, sessions }));
        showNote(true);
    }

    /* ---------- Session list ---------- */
    function renderList() {
        sessionList.innerHTML = '';
        if (!sessions.length) {
            sessionList.innerHTML = '<p class="admin-empty">No sessions yet — click "Add New Session" to create the first one.</p>';
            return;
        }
        sessions.forEach((s, i) => {
            const row = document.createElement('div');
            row.className = 'session-row';
            row.innerHTML =
                '<img src="' + escapeAttr(s.cover) + '" alt="">' +
                '<div class="info">' +
                    '<h4>' + escapeHtml(s.title) + '</h4>' +
                    '<p>' + (s.photos || []).length + ' photo(s) &middot; ' + escapeHtml(s.description || 'No description') + '</p>' +
                '</div>' +
                '<div class="row-actions">' +
                    '<button type="button" data-act="up" title="Move up">&uarr;</button>' +
                    '<button type="button" data-act="down" title="Move down">&darr;</button>' +
                    '<button type="button" data-act="edit" title="Edit">&#9998;</button>' +
                    '<button type="button" data-act="del" class="danger" title="Delete">&#10005;</button>' +
                '</div>';
            row.querySelector('[data-act=up]').addEventListener('click', () => moveSession(i, -1));
            row.querySelector('[data-act=down]').addEventListener('click', () => moveSession(i, 1));
            row.querySelector('[data-act=edit]').addEventListener('click', () => openForm(s));
            row.querySelector('[data-act=del]').addEventListener('click', () => deleteSession(s.id));
            sessionList.appendChild(row);
        });
    }

    function moveSession(i, dir) {
        const j = i + dir;
        if (j < 0 || j >= sessions.length) return;
        const tmp = sessions[i]; sessions[i] = sessions[j]; sessions[j] = tmp;
        saveDraft(); renderList();
    }

    function deleteSession(id) {
        if (!confirm('Delete this session? This cannot be undone.')) return;
        sessions = sessions.filter(s => s.id !== id);
        saveDraft(); renderList();
    }

    /* ---------- Add / edit form ---------- */
    addBtn.addEventListener('click', () => openForm(null));
    cancelBtn.addEventListener('click', closeForm);
    formOverlay.addEventListener('click', e => { if (e.target === formOverlay) closeForm(); });

    function openForm(session) {
        editingId = session ? session.id : null;
        formTitleEl.textContent = session ? 'Edit Session' : 'Add New Session';
        titleInput.value = session ? session.title : '';
        descInput.value = session ? (session.description || '') : '';
        coverInput.value = session ? (session.cover || '') : '';
        if (session && session.cover) {
            coverPreview.src = session.cover;
            coverPreview.style.visibility = 'visible';
        } else {
            coverPreview.src = '';
            coverPreview.style.visibility = 'hidden';
        }
        currentPhotos = session ? (session.photos || []).map(p => ({ filename: p, preview: p })) : [];
        renderPhotoRows();
        formOverlay.classList.add('active');
        titleInput.focus();
    }

    function closeForm() { formOverlay.classList.remove('active'); }

    coverFile.addEventListener('change', () => {
        const f = coverFile.files[0];
        if (!f) return;
        coverInput.value = f.name;
        coverPreview.src = URL.createObjectURL(f);
        coverPreview.style.visibility = 'visible';
    });

    photoFile.addEventListener('change', () => {
        Array.from(photoFile.files).forEach(f => {
            currentPhotos.push({ filename: f.name, preview: URL.createObjectURL(f) });
        });
        photoFile.value = '';
        renderPhotoRows();
    });

    addPhotoRowBtn.addEventListener('click', () => {
        currentPhotos.push({ filename: '', preview: '' });
        renderPhotoRows();
    });

    function renderPhotoRows() {
        photoRows.innerHTML = '';
        currentPhotos.forEach((p, i) => {
            const row = document.createElement('div');
            row.className = 'photo-row';
            row.innerHTML =
                '<img src="' + escapeAttr(p.preview) + '" style="' + (p.preview ? '' : 'visibility:hidden') + '">' +
                '<input type="text" value="' + escapeAttr(p.filename) + '" placeholder="filename.jpg">' +
                '<button type="button" title="Remove">&#10005;</button>';
            row.querySelector('input').addEventListener('input', e => { currentPhotos[i].filename = e.target.value; });
            row.querySelector('button').addEventListener('click', () => { currentPhotos.splice(i, 1); renderPhotoRows(); });
            photoRows.appendChild(row);
        });
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const title = titleInput.value.trim();
        if (!title) { titleInput.focus(); return; }
        const photos = currentPhotos.map(p => p.filename.trim()).filter(Boolean);
        const data = {
            id: editingId || (slugify(title) + '-' + Date.now().toString(36)),
            title: title,
            description: descInput.value.trim(),
            cover: coverInput.value.trim() || photos[0] || '',
            photos: photos
        };
        if (editingId) {
            const idx = sessions.findIndex(s => s.id === editingId);
            if (idx > -1) sessions[idx] = data;
        } else {
            sessions.push(data);
        }
        saveDraft(); renderList(); closeForm();
    });

    /* ---------- Export ---------- */
    exportBtn.addEventListener('click', () => {
        const json = JSON.stringify({ pageTitle: pageTitle, sessions: sessions }, null, 2);
        exportArea.value = json;
        exportArea.style.display = 'block';

        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = dataFile;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    });

    /* ---------- Helpers ---------- */
    function slugify(s) {
        return (String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || 'session';
    }
    function escapeHtml(str) {
        return String(str == null ? '' : str).replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
    }
    function escapeAttr(str) { return escapeHtml(str); }
}
