document.addEventListener('DOMContentLoaded', function () {
  var navTrigger = document.getElementById('nav-trigger');
  var navToggle = document.querySelector('.nav-toggle');
  var navList = document.querySelector('.nav-list');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supportsViewTransitions = 'startViewTransition' in document;
  var isNavigating = false;
  var themeToggle = document.getElementById('theme-toggle');

  // Theme management: respect stored preference, system, and allow toggle
  function getInitialTheme() {
    try {
      var stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') return stored;
    } catch (e) {}

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  function applyTheme(theme, withTransition) {
    if (withTransition) document.documentElement.classList.add('theme-transition');
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeToggle) themeToggle.setAttribute('aria-pressed', 'true');
      if (themeToggle) themeToggle.textContent = '☀️';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggle) themeToggle.setAttribute('aria-pressed', 'false');
      if (themeToggle) themeToggle.textContent = '🌙';
    }

    window.setTimeout(function () {
      document.documentElement.classList.remove('theme-transition');
    }, 400);
  }

  var currentTheme = getInitialTheme();
  applyTheme(currentTheme, false);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch (e) {}
      applyTheme(next, true);
    });
  }

  function syncNav() {
    if (!navTrigger || !navToggle) {
      return;
    }

    navToggle.setAttribute('aria-expanded', navTrigger.checked ? 'true' : 'false');
  }

  if (navTrigger && navToggle) {
    navTrigger.addEventListener('change', syncNav);
    syncNav();

    document.addEventListener('click', function (event) {
      if (!navTrigger.checked || !navList) {
        return;
      }

      if (!navList.contains(event.target) && event.target !== navToggle && !navToggle.contains(event.target)) {
        navTrigger.checked = false;
        syncNav();
      }
    });
  }

  try {
    document.querySelectorAll('pre > code').forEach(function (codeBlock) {
      var pre = codeBlock.parentNode;

      if (!pre || pre.querySelector('.code-copy-btn')) {
        return;
      }

      var button = document.createElement('button');
      button.className = 'code-copy-btn';
      button.type = 'button';
      button.textContent = 'Copy';

      button.addEventListener('click', function () {
        if (!navigator.clipboard) {
          return;
        }

        navigator.clipboard.writeText(codeBlock.innerText).then(function () {
          button.textContent = 'Copied';
          window.setTimeout(function () {
            button.textContent = 'Copy';
          }, 1400);
        });
      });

      pre.style.position = 'relative';
      pre.appendChild(button);
    });
  } catch (error) {
    /* ignore copy button errors */
  }

  try {
    document.querySelectorAll('a[href]').forEach(function (link) {
      var href = link.getAttribute('href');

      if (!href) {
        return;
      }

      if (/^https?:/i.test(href)) {
        var url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      }
    });
  } catch (error) {
    /* ignore external link errors */
  }

  function isTransitionCandidate(link) {
    var href = link.getAttribute('href');
    var url;

    if (!href || href.charAt(0) === '#') {
      return false;
    }

    if (link.hasAttribute('download') || link.dataset.noTransition !== undefined) {
      return false;
    }

    if (link.target && link.target !== '_self') {
      return false;
    }

    if (/^(mailto:|tel:|javascript:)/i.test(href)) {
      return false;
    }

    try {
      url = new URL(link.href, window.location.href);
    } catch (error) {
      return false;
    }

    if (url.origin !== window.location.origin) {
      return false;
    }

    if (!/^https?:$/i.test(url.protocol)) {
      return false;
    }

    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
      return false;
    }

    if (/\.(pdf|png|jpe?g|svg|gif|webp|zip|mp4|mp3)$/i.test(url.pathname)) {
      return false;
    }

    return true;
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a');
    var targetUrl;

    if (!link || event.defaultPrevented || prefersReducedMotion || isNavigating) {
      return;
    }

    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    if (!isTransitionCandidate(link)) {
      return;
    }

    if (navTrigger) {
      navTrigger.checked = false;
      syncNav();
    }

    if (supportsViewTransitions) {
      return;
    }

    event.preventDefault();
    isNavigating = true;
    targetUrl = link.href;

    document.body.classList.add('is-leaving');

    window.setTimeout(function () {
      window.location.assign(targetUrl);
    }, 380);
  });

  window.addEventListener('pageshow', function () {
    document.body.classList.remove('is-leaving');
    isNavigating = false;
  });

  try {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var id = link.getAttribute('href').slice(1);
        var target = id ? document.getElementById(id) : null;

        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });
  } catch (error) {
    /* ignore smooth scroll errors */
  }

  // Blog section tab switching
  try {
    var blogNavLinks = document.querySelectorAll('.blog-nav-link');
    var blogSections = document.querySelectorAll('.archive-section');

    blogNavLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        var targetId = this.getAttribute('href').slice(1);

        // Remove active class from all links and sections
        blogNavLinks.forEach(function (l) { l.classList.remove('active'); });
        blogSections.forEach(function (s) { s.classList.remove('active'); });

        // Add active class to clicked link and corresponding section
        this.classList.add('active');
        document.getElementById(targetId).classList.add('active');
      });
    });
  } catch (error) {
    /* ignore blog nav errors */
  }

  // Learnings section tab switching and content distribution
  try {
    var learningsNavLinks = document.querySelectorAll('.learnings-nav-link');
    var learningsSections = document.querySelectorAll('.learnings-section');

    // Distribute learning items to appropriate sections
    function distributeLearnings() {
      var allSection = document.getElementById('all-learnings');
      var technicalSection = document.getElementById('technical');
      var philosophicalSection = document.getElementById('philosophical');

      if (!allSection || !technicalSection || !philosophicalSection) return;

      // Clear existing items in sections (except the intro paragraphs)
      [technicalSection, philosophicalSection].forEach(function(section) {
        var items = section.querySelectorAll('.learning-item');
        items.forEach(function(item) { item.remove(); });
      });

      // Get all learning items (they should be in all-learnings section)
      var allItems = allSection.querySelectorAll('.learning-item');

      allItems.forEach(function(item) {
        if (item.classList.contains('technical')) {
          var clone = item.cloneNode(true);
          technicalSection.appendChild(clone);
        } else if (item.classList.contains('philosophical')) {
          var clone = item.cloneNode(true);
          philosophicalSection.appendChild(clone);
        }
      });
    }

    // Initial distribution
    distributeLearnings();

    learningsNavLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        var targetId = this.getAttribute('href').slice(1);

        // Remove active class from all links and sections
        learningsNavLinks.forEach(function (l) { l.classList.remove('active'); });
        learningsSections.forEach(function (s) { s.classList.remove('active'); });

        // Add active class to clicked link and corresponding section
        this.classList.add('active');
        document.getElementById(targetId).classList.add('active');
      });
    });
  } catch (error) {
    /* ignore learnings nav errors */
  }

  // Notes page: course/chapter toggles (clean UI, animated)
  try {
    var coursesList = document.querySelector('.courses-list');
    if (coursesList) {
      // enhance buttons with keyboard and aria support
      function setupToggle(button, target) {
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        button.addEventListener('click', function () {
          var expanded = button.getAttribute('aria-expanded') === 'true';
          button.setAttribute('aria-expanded', (!expanded).toString());
          target.classList.toggle('open');
        });
        button.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
          }
        });
      }

      document.querySelectorAll('.course-item').forEach(function (courseEl) {
        var btn = courseEl.querySelector('.course-toggle');
        var chapters = courseEl.querySelector('.chapters-list');
        if (!btn || !chapters) return;
        setupToggle(btn, chapters);

        courseEl.querySelectorAll('.chapter-item').forEach(function (chapEl) {
          var cbtn = chapEl.querySelector('.chapter-toggle');
          var notes = chapEl.querySelector('.notes-list');
          if (!cbtn || !notes) return;
          setupToggle(cbtn, notes);
        });
      });
    }
  } catch (error) {
    /* ignore notes toggles errors */
  }
  // Final math render pass + image fallbacks once all resources have loaded
  window.addEventListener('load', function () {
    // Best-effort client-side math rendering (covers any remaining raw $/\(...\) math)
    if (window.renderMathInElement) {
      try {
        renderMathInElement(document.body, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      } catch (e) {
        console.warn('KaTeX auto-render final pass failed:', e);
      }
    }

    // Image fallback: some markdowns reference images as bare filenames (e.g. image.png).
    // Browsers will resolve those relative to the page's path which may not match the
    // location where the static generator placed them. Try a few sensible prefixes if
    // the image fails to load.
    document.querySelectorAll('img').forEach(function (img) {
      var src = img.getAttribute('src') || '';
      if (!src || /^(https?:|\/)/i.test(src)) return; // absolute or external already

      var tried = 0;
      var prefixes = [
        // same directory as the page
        window.location.pathname.replace(/[^\/]*$/, ''),
        // common output locations
        '/posts/', '/notes/', '/assets/', '/images/', '/'
      ];

      function tryNext() {
        if (tried >= prefixes.length) return;
        var prefix = prefixes[tried++];
        // normalize
        if (!prefix.endsWith('/')) prefix += '/';
        var candidate = prefix + src.replace(/^\//, '');
        // set a short timeout to allow onerror to fire if it fails
        img.src = candidate;
      }

      // attach error handler to cycle through candidates
      img.addEventListener('error', function onErr() {
        // remove and re-add to avoid multiple calls
        img.removeEventListener('error', onErr);
        tryNext();
        // if more candidates remain, reattach handler
        if (tried < prefixes.length) img.addEventListener('error', onErr);
      });

      // trigger the first attempt (this will keep original src first)
      // if original fails the error handler will cycle through candidates
      // If original src already started loading, resetting to same value has no effect,
      // so start with first candidate only if original is a bare filename.
      if (!src.startsWith('./') && !src.startsWith('../')) {
        // leave original; error handler will catch failures
      } else {
        tryNext();
      }
    });
  });
});
