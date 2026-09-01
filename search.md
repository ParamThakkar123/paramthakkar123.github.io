---
layout: page.academic
permalink: /search.html
kicker: Search
title: Search
description: Search across blog posts, notes, and project pages.
sitemap: false
---

<div class="site-search" data-search>
  <label class="sr-only" for="search-input">Search this site</label>
  <input
    type="search"
    id="search-input"
    class="search-input"
    placeholder="Search posts, notes, and projects…"
    autocomplete="off"
    autocapitalize="off"
    spellcheck="false"
    data-search-input>

  <p class="search-status muted" role="status" aria-live="polite" data-search-status>Loading the index…</p>

  <ul class="search-results" data-search-results></ul>
</div>

<noscript>
  <p class="muted">Search needs JavaScript. You can browse the <a href="{{ '/archive.html' | relative_url }}">blog archive</a> and <a href="{{ '/notes.html' | relative_url }}">notes</a> directly instead.</p>
</noscript>

<script src="{{ '/js/search.js' | relative_url }}" defer data-index="{{ '/search-index.json' | relative_url }}"></script>
