---
layout: page
kicker: Notes
title: Notes
description: Short notes, snippets, and technical reference materials.
---

<div class="archive-container">
  {%- assign sorted_notes = site.notes | sort: 'date' | reverse -%}

  {%- comment -%}
  Group notes by `course` front-matter and then by `chapter`.
  Notes should include `course: Course Name` and `chapter: Chapter Name` in their front matter.
  If those fields are missing, they fall back to "General" / "Misc".
  {%- endcomment -%}

  {%- assign courses = sorted_notes | group_by: 'course' -%}

  <ul class="courses-list">
    {% for course in courses %}
      {%- assign course_name = course.name | default: "General" -%}
      <li class="course-item">
        <button class="course-toggle" aria-expanded="false">{{ course_name }} <span class="count">({{ course.items | size }})</span></button>

        {%- assign chapters = course.items | sort: 'chapter' | group_by: 'chapter' -%}
        <ul class="chapters-list" hidden>
          {% for chapter in chapters %}
            {%- assign chapter_name = chapter.name | default: "Misc" -%}
            <li class="chapter-item">
              <button class="chapter-toggle" aria-expanded="false">{{ chapter_name }} <span class="count">({{ chapter.items | size }})</span></button>

              <ul class="notes-list" hidden>
                {% for note in chapter.items | sort: 'date' | reverse %}
                  <li class="note-item">
                    <a href="{{ note.url | relative_url }}">{{ note.title }}</a>
                    <div class="note-meta">{{ note.date | date: "%b %d, %Y" }}{% if note.excerpt %} · {{ note.excerpt | strip_html | truncate: 120 }}{% endif %}</div>
                  </li>
                {% endfor %}
              </ul>
            </li>
          {% endfor %}
        </ul>
      </li>
    {% endfor %}
  </ul>
</div>

{% if site.notes.size == 0 %}
<p>No notes yet. Check back soon!</p>
{% endif %}

<script>
// Small script to toggle course/chapter lists on the notes page.
document.addEventListener('DOMContentLoaded', function () {
  function toggleButton(btn, target) {
    var expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', (!expanded).toString());
    if (expanded) {
      target.setAttribute('hidden', '');
    } else {
      target.removeAttribute('hidden');
    }
  }

  document.querySelectorAll('.course-item').forEach(function (courseEl) {
    var btn = courseEl.querySelector('.course-toggle');
    var chapters = courseEl.querySelector('.chapters-list');
    if (!btn || !chapters) return;
    btn.addEventListener('click', function () { toggleButton(btn, chapters); });

    // chapter toggles inside this course
    courseEl.querySelectorAll('.chapter-item').forEach(function (chapEl) {
      var cbtn = chapEl.querySelector('.chapter-toggle');
      var notes = chapEl.querySelector('.notes-list');
      if (!cbtn || !notes) return;
      cbtn.addEventListener('click', function () { toggleButton(cbtn, notes); });
    });
  });
});
</script>
