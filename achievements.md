---
layout: page.academic
title: Achievements
permalink: /achievements.html
---

Below are selected achievements and recognitions.

<ul class="pub-list">
{%- for a in site.data.achievements -%}
  <li>
    <div>
      <strong>{{ a.title }}</strong>
      <div class="muted">{{ a.org }}, {{ a.year }}</div>
      <p class="muted">{{ a.description }}</p>
    </div>
    {% if a.link %}<div><a href="{{ a.link }}">Details</a></div>{% endif %}
  </li>
{%- endfor -%}
</ul>
