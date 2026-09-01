document.addEventListener('DOMContentLoaded', function () {
  var navToggle = document.getElementById('nav-toggle');
  var navList = document.querySelector('.nav-list');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supportsViewTransitions = 'startViewTransition' in document;
  var isNavigating = false;
  var themeToggle = document.getElementById('theme-toggle');

  // Theme management. The initial theme is already applied by the inline script
  // in <head> (which runs before first paint to avoid a flash); this only keeps
  // the toggle's state in sync and handles clicks.
  //
  // NOTE: never write to themeToggle.textContent here — the button's contents
  // are the sun/moon SVGs from site-header.html plus its screen-reader label,
  // and the sun/moon crossfade is driven purely by CSS off html[data-theme].
  function applyTheme(theme, withTransition) {
    if (withTransition) document.documentElement.classList.add('theme-transition');

    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      themeToggle.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    window.setTimeout(function () {
      document.documentElement.classList.remove('theme-transition');
    }, 400);
  }

  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch (e) {}
      applyTheme(next, true);
    });
  }

  // Follow the OS setting for as long as the visitor hasn't picked one.
  if (window.matchMedia) {
    var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    var onSchemeChange = function (event) {
      var stored;
      try { stored = localStorage.getItem('theme'); } catch (e) {}
      if (stored === 'dark' || stored === 'light') return;
      applyTheme(event.matches ? 'dark' : 'light', true);
    };

    if (darkQuery.addEventListener) {
      darkQuery.addEventListener('change', onSchemeChange);
    } else if (darkQuery.addListener) {
      darkQuery.addListener(onSchemeChange);
    }
  }

  function navIsOpen() {
    return !!navToggle && navToggle.getAttribute('aria-expanded') === 'true';
  }

  function setNavOpen(open) {
    if (!navToggle) return;
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      setNavOpen(!navIsOpen());
    });

    // Click outside to dismiss.
    document.addEventListener('click', function (event) {
      if (!navIsOpen() || !navList) return;

      if (!navList.contains(event.target) && !navToggle.contains(event.target)) {
        setNavOpen(false);
      }
    });

    // Escape closes the menu and returns focus to the button that opened it.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navIsOpen()) {
        setNavOpen(false);
        navToggle.focus();
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

    setNavOpen(false);

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
  // The src-guessing image fallback that used to live here was a workaround for
  // post images sitting in _posts/, which Jekyll never publishes. Those images
  // now live in assets/blog/ and are referenced properly, so every <img> resolves
  // on the first try and the retry loop is gone.
});
