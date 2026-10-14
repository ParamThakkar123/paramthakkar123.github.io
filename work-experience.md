---
layout: page.academic
title: Work Experience
permalink: /work-experience.html
---

Below is a summary of professional roles and internships.

<ul class="pub-list work-list">
{%- for w in site.data.work_experience -%}
  <li>
    <div class="org-logo">
      {%- if w.logo -%}
        <img src="{{ w.logo | relative_url }}" alt="{{ w.org }} logo" width="56" height="56" {% if forloop.index <= 3 %}loading="eager"{% else %}loading="lazy"{% endif %} decoding="async">
      {%- else -%}
        <span aria-hidden="true">{{ w.org | slice: 0 }}</span>
      {%- endif -%}
    </div>
    <div>
      <strong>{{ w.role }}</strong>
      <div class="muted">{{ w.org }} · {{ w.start }}{% if w.end %} – {{ w.end }}{% endif %}</div>
      <p class="muted">{{ w.description }}</p>
    </div>
    {% if w.link %}<div><a href="{{ w.link }}">Details</a></div>{% endif %}
  </li>
{%- endfor -%}
</ul>
