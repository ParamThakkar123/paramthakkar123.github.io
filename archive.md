---
layout: page
kicker: Blogs
title: Blog Archive
description: Blog posts, notes, and technical write-ups collected by tag.
---

{% for tag in site.tags %}
  <section class="archive-group">
    <h2>{{ tag[0] }}</h2>
    <ul class="archive-list">
      {% for post in tag[1] %}
        <li><a href="{{ post.url | relative_url }}">{{ post.date | date: "%B %Y" }} · {{ post.title }}</a></li>
      {% endfor %}
    </ul>
  </section>
{% endfor %}
