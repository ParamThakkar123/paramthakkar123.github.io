---
layout: page
kicker: Blogs
title: Blog Archive
description: Blog posts, notes, and technical write-ups collected by tag.
---

<div class="blog-sections">
  <nav class="blog-nav">
    <a href="#all-blogs" class="blog-nav-link active">All Blogs</a>
    <a href="#technology" class="blog-nav-link">Technology</a>
    <a href="#philosophical" class="blog-nav-link">Philosophical</a>
  </nav>

  <section id="all-blogs" class="archive-section active">
    <h2>All Blogs</h2>
    <ul class="archive-list">
      {% for post in site.posts %}
        <li><a href="{{ post.url | relative_url }}">{{ post.date | date: "%B %Y" }} · {{ post.title }}</a></li>
      {% endfor %}
    </ul>
  </section>

  <section id="technology" class="archive-section">
    <h2>Technology</h2>
    <ul class="archive-list">
      {% for post in site.posts %}
        {% if post.tags contains "technology" %}
          <li><a href="{{ post.url | relative_url }}">{{ post.date | date: "%B %Y" }} · {{ post.title }}</a></li>
        {% endif %}
      {% endfor %}
    </ul>
  </section>

  <section id="philosophical" class="archive-section">
    <h2>Philosophical</h2>
    <ul class="archive-list">
      {% for post in site.posts %}
        {% if post.tags contains "philosophical" %}
          <li><a href="{{ post.url | relative_url }}">{{ post.date | date: "%B %Y" }} · {{ post.title }}</a></li>
        {% endif %}
      {% endfor %}
    </ul>
  </section>
</div>
