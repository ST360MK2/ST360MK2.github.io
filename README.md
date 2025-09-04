# Mein Blog

## Struktur

- `index.html` → Blogübersicht
- `posts/` → alle Blogposts
- `posts/posts.json` → Metadaten für Übersicht
- `templates/blog-template.html` → Vorlage für neue Posts
- `style.css` → Stylesheet
- `js/main.js` → Logik für Übersicht & Footer

## Neuen Blogpost anlegen

1. Ordner unter `posts/<Jahr>/<post-name>/` erstellen.
2. `index.html` für den Post erstellen (oder von `blog-template.html` kopieren).
3. Bilder in einen Unterordner `bilder/` legen.
4. `posts/posts.js` aktualisieren:
   ```js
   {
      title: "Neuer Post",
      href: "/posts/2025/neuer-post/index.html",
      date: "2025-09-02",
      excerpt: "Kurzbeschreibung...",
      tags: ["neu","test","blog","example","post","3xample"]
  },
