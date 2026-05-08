---
title: Param Thakkar
layout: page.academic
home: true
description: Computer Science undergraduate at VJTI working on reinforcement learning, generative modeling, and world models.
---

<div class="home-grid">
  <aside class="content-surface profile-rail">
    <div class="portrait-frame">
      <img src="{{ '/assets/new_photo.jpg' | relative_url }}" alt="Portrait of Param Thakkar" class="profile-photo">
    </div>

    <div class="profile-heading">
      <p class="eyebrow">Profile</p>
      <h1>Param Thakkar</h1>
      <p class="profile-role">Computer Science Undergraduate</p>
      <p class="profile-focus">VJTI, Mumbai · Reinforcement Learning · Generative Modeling · World Models</p>
    </div>

    <ul class="contact-list">
      {% if site.email %}
        <li><a href="mailto:{{ site.email }}"><span>Email</span><strong>{{ site.email }}</strong></a></li>
      {% endif %}
      {% if site.linkedin_url %}
        <li><a href="{{ site.linkedin_url }}" target="_blank" rel="noopener"><span>LinkedIn</span><strong>{{ site.linkedin_username | default: site.author }}</strong></a></li>
      {% endif %}
      {% if site.github_url %}
        <li><a href="{{ site.github_url }}" target="_blank" rel="noopener"><span>GitHub</span><strong>{{ site.github_username | default: site.author }}</strong></a></li>
      {% endif %}
      {% if site.twitter_url %}
        <li><a href="{{ site.twitter_url }}" target="_blank" rel="noopener"><span>X</span><strong>@Param23072004</strong></a></li>
      {% endif %}
      {% if site.google_scholar_url %}
        <li><a href="{{ site.google_scholar_url }}" target="_blank" rel="noopener"><span>Google Scholar</span><strong>Profile</strong></a></li>
      {% endif %}
      <li><a href="{{ '/Param_Thakkar_Res.pdf' | relative_url }}"><span>Curriculum Vitae</span><strong>PDF</strong></a></li>
      <li><a href="{{ '/journey.html' | relative_url }}"><span>Journey</span><strong>Learning notes</strong></a></li>
    </ul>

    <p class="rail-note">This site is a living notebook for ideas, projects, and technical writing that I want to make clearer, sharper, and more useful over time.</p>
  </aside>

  <div class="section-stack">
    <section class="content-surface section-card">
      <p class="eyebrow">Bio</p>
      <h2>Building a strong technical foundation while exploring ambitious ideas.</h2>
      <p class="lead">I’m a computer science undergraduate at VJTI, Mumbai, interested in reinforcement learning, generative modeling, and world models.</p>
      <p>My work so far has been driven by curiosity and iteration: reading, experimenting, writing, and turning difficult concepts into smaller systems that can be tested and understood. I like research-flavored projects, careful technical communication, and interfaces that make technical work feel approachable.</p>
      <p>This website brings those threads together through project pages, publication records, blog posts, and a running archive of what I am learning next.</p>
    </section>

    <section class="content-surface section-card">
      <p class="eyebrow">Research</p>
      <h2>Current areas of interest</h2>
      <p>I am especially drawn to technically grounded work that balances experimentation with clarity.</p>

      <blockquote class="callout">I’m most energized by projects that take abstract ideas and turn them into something people can inspect, reproduce, and learn from.</blockquote>

      <div class="interest-list">
        <div class="interest-item">
          <div class="interest-label">Reinforcement Learning</div>
          <p>Learning through interaction, decision making over time, and building intuition for how agents improve through feedback.</p>
        </div>
        <div class="interest-item">
          <div class="interest-label">Generative Modeling</div>
          <p>Studying how models represent structure, generate samples, and capture complex patterns in data.</p>
        </div>
        <div class="interest-item">
          <div class="interest-label">World Models</div>
          <p>Exploring internal representations of environments and dynamics so systems can plan, predict, and reason more effectively.</p>
        </div>
        <div class="interest-item">
          <div class="interest-label">Mechanistic Interpretability and AI Safety</div>
          <p>Understanding how neural networks work internally and ensuring AI systems are aligned with human values and safe.</p>
        </div>
      </div>
    </section>

    <section class="content-surface section-card">
      <p class="eyebrow">Achievements</p>
      <h2>Selected achievements</h2>
      <ul class="pub-list">
      {%- for a in site.data.achievements -%}
        <li>
          <div>
            <strong>{{ a.title }}</strong> <span class="muted">— {{ a.org }}, {{ a.year }}</span>
            <p class="muted">{{ a.description }}</p>
          </div>
          {% if a.link %}<div><a href="{{ a.link }}">Details</a></div>{% endif %}
        </li>
      {%- endfor -%}
      </ul>
    </section>

    <section class="content-surface section-card">
      <p class="eyebrow">Blogs</p>
      <h2>Recent posts</h2>
      <div class="list-grid">
        <div class="list-card">
          <p class="muted">Writing one soon, stay tuned</p>
        </div>
      </div>
    </section>

    <section class="content-surface section-card">
      <p class="eyebrow">Explore</p>
      <h2>More of the site</h2>
      <div class="project-grid">
        <a class="mini-card" href="{{ '/publications.html' | relative_url }}">
          <span class="meta-line">Research Output</span>
          <h3>Publications</h3>
          <p>Browse papers, reports, and references collected in one place.</p>
        </a>
        <a class="mini-card" href="{{ '/open-source.html' | relative_url }}">
          <span class="meta-line">Public Code</span>
          <h3>Open Source</h3>
          <p>Repositories, experiments, and projects that are shared publicly.</p>
        </a>
      </div>
    </section>
  </div>
</div>
