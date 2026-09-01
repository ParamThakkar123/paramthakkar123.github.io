// Client-side search over /search-index.json.
//
// The index is small enough (a few hundred KB at most) that a dependency-free
// scorer beats pulling in a search library: fetch once, rank on every keystroke.
(function () {
  'use strict';

  var root = document.querySelector('[data-search]');
  if (!root) return;

  var input = root.querySelector('[data-search-input]');
  var status = root.querySelector('[data-search-status]');
  var results = root.querySelector('[data-search-results]');
  var indexUrl = (document.currentScript && document.currentScript.dataset.index) || '/search-index.json';

  var entries = null;
  var MAX_RESULTS = 25;

  function normalize(value) {
    return (value || '').toLowerCase();
  }

  // Weighted term matching: a hit in the title counts for much more than one
  // buried in the body, and a whole-word hit beats a substring.
  function scoreEntry(entry, terms) {
    var title = entry._title;
    var tags = entry._tags;
    var body = entry._body;
    var total = 0;

    for (var i = 0; i < terms.length; i++) {
      var term = terms[i];
      var score = 0;

      if (title.indexOf(term) !== -1) {
        score += 10;
        if (new RegExp('\\b' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(title)) score += 6;
        if (title.indexOf(term) === 0) score += 4;
      }
      if (tags.indexOf(term) !== -1) score += 5;
      if (body.indexOf(term) !== -1) score += 2;

      // Every term must appear somewhere, so the search behaves like AND.
      if (score === 0) return 0;
      total += score;
    }

    return total;
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Pull a window of body text around the first matching term.
  function snippetFor(entry, terms) {
    var body = entry.body || '';
    var lower = entry._body;
    var at = -1;

    for (var i = 0; i < terms.length && at === -1; i++) {
      at = lower.indexOf(terms[i]);
    }
    if (at === -1) return body.slice(0, 160);

    var start = Math.max(0, at - 70);
    var text = body.slice(start, start + 190);
    return (start > 0 ? '…' : '') + text + (start + 190 < body.length ? '…' : '');
  }

  function highlight(text, terms) {
    var out = escapeHtml(text);
    for (var i = 0; i < terms.length; i++) {
      var safe = terms[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      out = out.replace(new RegExp('(' + safe + ')', 'gi'), '<mark>$1</mark>');
    }
    return out;
  }

  function render(matches, terms, query) {
    results.innerHTML = '';

    if (!matches.length) {
      status.textContent = 'No results for “' + query + '”.';
      return;
    }

    status.textContent =
      matches.length + (matches.length === 1 ? ' result' : ' results') +
      (matches.length === MAX_RESULTS ? ' (showing the top ' + MAX_RESULTS + ')' : '');

    var fragment = document.createDocumentFragment();

    matches.forEach(function (entry) {
      var li = document.createElement('li');
      li.className = 'search-result';
      li.innerHTML =
        '<a href="' + escapeHtml(entry.url) + '">' +
          '<span class="meta-line">' + escapeHtml(entry.kind) +
            (entry.date ? ' · ' + escapeHtml(entry.date) : '') +
          '</span>' +
          '<h3>' + highlight(entry.title, terms) + '</h3>' +
          '<p class="muted">' + highlight(snippetFor(entry, terms), terms) + '</p>' +
        '</a>';
      fragment.appendChild(li);
    });

    results.appendChild(fragment);
  }

  function search() {
    var query = input.value.trim();

    if (!entries) return;

    if (query.length < 2) {
      results.innerHTML = '';
      status.textContent = entries.length + ' pages indexed. Type at least two characters.';
      return;
    }

    var terms = normalize(query).split(/\s+/).filter(Boolean);
    var matches = [];

    for (var i = 0; i < entries.length; i++) {
      var score = scoreEntry(entries[i], terms);
      if (score > 0) matches.push({ entry: entries[i], score: score });
    }

    matches.sort(function (a, b) { return b.score - a.score; });
    render(matches.slice(0, MAX_RESULTS).map(function (m) { return m.entry; }), terms, query);
  }

  function debounce(fn, wait) {
    var timer;
    return function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(fn, wait);
    };
  }

  fetch(indexUrl)
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function (data) {
      entries = data;
      // Precompute the lowercased fields once rather than per keystroke.
      entries.forEach(function (entry) {
        entry._title = normalize(entry.title);
        entry._tags = normalize(entry.tags);
        entry._body = normalize(entry.body);
      });

      status.textContent = entries.length + ' pages indexed. Type at least two characters.';
      input.disabled = false;

      // Support deep links like /search.html?q=dreamer
      var initial = new URLSearchParams(window.location.search).get('q');
      if (initial) {
        input.value = initial;
        search();
      }
      input.focus();
    })
    .catch(function (error) {
      status.textContent = 'Could not load the search index.';
      console.warn('search: failed to load index', error);
    });

  input.addEventListener('input', debounce(search, 120));
  input.addEventListener('search', search);
})();
