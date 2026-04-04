document.addEventListener('DOMContentLoaded', function () {
  var navTrigger = document.getElementById('nav-trigger');
  var navToggle = document.querySelector('.nav-toggle');
  var navList = document.querySelector('.nav-list');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supportsViewTransitions = 'startViewTransition' in document;
  var isNavigating = false;

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
});
