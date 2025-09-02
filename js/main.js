// main.js

document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------
  // 1. Jahr im Footer setzen
  // ---------------------------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------------------------
  // 2. Blog-Übersicht Funktionen
  // ---------------------------
  const $grid = document.getElementById("grid");
  const $q = document.getElementById("q");
  const $sort = document.getElementById("sort");
  const $tagBar = document.getElementById("tagBar");

  if ($grid) {
    let POSTS = [];
    const state = { query: "", activeTags: new Set(), sort: "date-desc" };

    function formatDate(iso) {
      return new Date(iso + "T00:00:00").toLocaleDateString("de-DE", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    }

    function uniqueTags() {
      const all = new Set();
      POSTS.forEach((p) => p.tags?.forEach((t) => all.add(t)));
      return Array.from(all).sort((a, b) => a.localeCompare(b, "de"));
    }

    function renderTags() {
      $tagBar.innerHTML = "";
      uniqueTags().forEach((t) => {
        const btn = document.createElement("button");
        btn.className = "tag";
        btn.type = "button";
        btn.textContent = t;
        btn.dataset.tag = t;
        btn.addEventListener("click", () => {
          if (state.activeTags.has(t)) state.activeTags.delete(t);
          else state.activeTags.add(t);
          render();
        });
        $tagBar.appendChild(btn);
      });

      if (uniqueTags().length) {
        const clear = document.createElement("button");
        clear.className = "clear-tags";
        clear.type = "button";
        clear.textContent = "Tags zurücksetzen";
        clear.addEventListener("click", () => {
          state.activeTags.clear();
          render();
        });
        $tagBar.appendChild(clear);
      }
    }

    function matches(post) {
      const q = state.query.trim().toLowerCase();
      const text = (post.title + " " + (post.excerpt || "") + " " + (post.tags || []).join(" ")).toLowerCase();
      const tagOk = !state.activeTags.size || (post.tags || []).some((t) => state.activeTags.has(t));
      return (!q || text.includes(q)) && tagOk;
    }

    function sortPosts(a, b) {
      switch (state.sort) {
        case "date-asc": return (a.date || "").localeCompare(b.date || "");
        case "title-asc": return a.title.localeCompare(b.title, "de");
        case "title-desc": return b.title.localeCompare(a.title, "de");
        default: return (b.date || "").localeCompare(a.date || "");
      }
    }

    function render() {
      document.querySelectorAll(".tag").forEach((el) => {
        el.classList.toggle("active", state.activeTags.has(el.dataset.tag));
      });

      const items = POSTS.filter(matches).sort(sortPosts);
      $grid.innerHTML = items.length
        ? items.map(
            (p) => `
          <article class="card">
            <a href="${p.href}">
              <div class="title">${p.title}</div>
              <div class="meta">${p.date ? formatDate(p.date) : ""}</div>
              <p class="excerpt">${p.excerpt || ""}</p>
              <div class="card-tags">${(p.tags || []).map((t) => `<span class="chip">${t}</span>`).join("")}</div>
            </a>
          </article>`
          ).join('')
        : `<div class="panel" style="grid-column:1/-1"><em>Keine Treffer. Passe Suche oder Tags an.</em></div>`;
    }

    // ---------------------------
    // 3. JSON laden
    // ---------------------------
    fetch("/posts/posts.json")
      .then(res => res.json())
      .then(data => {
        POSTS = data;
        renderTags();
        render();
      })
      .catch(err => console.error("Fehler beim Laden von posts.json:", err));

    if ($q) $q.addEventListener("input", (e) => { state.query = e.target.value; render(); });
    if ($sort) $sort.addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  }

  // ---------------------------
  // 4. Blogpost-spezifische JS
  // ---------------------------
  // z.B. Lightbox oder Scroll-to-Top
});
