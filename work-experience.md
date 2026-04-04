---
layout: page.academic
title: Work Experience
permalink: /work-experience.html
---

Below is a summary of professional roles and internships.

<ul class="pub-list">
{%- for w in site.data.work_experience -%}
  <li>
    <div>
      <strong>{{ w.role }}</strong>
      <div class="muted">{{ w.org }} · {{ w.start }}{% if w.end %} – {{ w.end }}{% endif %}</div>
      <p class="muted">{{ w.description }}</p>
    </div>
    {% if w.link %}<div><a href="{{ w.link }}">Details</a></div>{% endif %}
  </li>
{%- endfor -%}
</ul>
