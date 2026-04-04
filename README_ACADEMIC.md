This repository has been upgraded to a simple academic website layout.

What I changed:
- Added hero and improved CSS in `css/override.css`.
- Created `publications.md` and `_data/publications.yml` to list publications without plugins.
- Added `_bibliography.bib` and enabled `jekyll-scholar` in `_config.yml` for optional BibTeX support via GitHub Actions.
- Added `.github/workflows/jekyll-build.yml` to build the site with `jekyll-scholar` (artifact `_site`).
- Scaffolding for projects under `projects/` and an academic page layout `_layouts/page.academic.html`.

Next steps for you (recommended order):
1. Replace `/assets/profile.jpg` with your profile photo.
2. Replace `/cv.pdf` with your actual CV PDF.
3. Update contact details in `index.md`.
4. Fill `_data/publications.yml` with your real publications or replace `_bibliography.bib` with your BibTeX file.
5. If you use GitHub Pages (no actions), prefer `_data/publications.yml`. If you want jekyll-scholar, keep the Actions workflow — it builds and produces `_site` artifact.

If you want, I can now:
- populate publications from a BibTeX you upload
- replace placeholders with your real assets
- refine styling and add accessibility improvements
