---
layout: page
title: Publications
kicker: Research Output
description: Papers, technical reports, and references connected to my work and evolving interests.
---

{% assign pubs = site.data.publications | sort: 'year' | reverse %}

{% if pubs and pubs.size > 0 %}
  <ul class="pub-list">
    {% for p in pubs %}
      <li>
        <div>
          <p class="pub-authors">{{ p.authors }}</p>
          <h3>{{ p.title }}</h3>
          <p class="pub-details">
            {{ p.venue }}
            <span class="muted">({{ p.year }})</span>
            {% if p.type %} · {{ p.type }}{% endif %}
            {% if p.note %} · {{ p.note }}{% endif %}
          </p>
        </div>
        <div class="pub-actions">
          {% if p.pdf %}<a href="{{ p.pdf }}">PDF</a>{% endif %}
          {% if p.url %}<a href="{{ p.url }}">{{ p.url_label | default: "Link" }}</a>{% endif %}
          {% if p.doi %}<a href="https://doi.org/{{ p.doi }}">DOI</a>{% endif %}
        </div>
      </li>
    {% endfor %}
  </ul>
{% else %}
  <p>No publications are listed yet.</p>
{% endif %}

<!-- supporting note removed as requested -->
