---
layout: page
kicker: Notes
title: Notes
description: Short notes, snippets, and technical reference materials.
---

<div class="archive-container">
  <ul class="archive-list">
    {% assign sorted_notes = site.notes | sort: 'date' | reverse %}
    {% for note in sorted_notes %}
      <li>
        <a href="{{ note.url | relative_url }}">{{ note.date | date: "%B %Y" }} · {{ note.title }}</a>
        {% if note.excerpt %}
          <p class="note-excerpt">{{ note.excerpt | strip_html | truncate: 100 }}</p>
        {% endif %}
      </li>
    {% endfor %}
  </ul>
</div>

{% if site.notes.size == 0 %}
<p>No notes yet. Check back soon!</p>
{% endif %}