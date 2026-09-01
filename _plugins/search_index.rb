# Writes /search-index.json, consumed by js/search.js.
#
# This deliberately isn't a Liquid template. A template is itself a page, so it
# renders at some arbitrary point in the build and sees whatever siblings happen
# to have been rendered already — pages processed later leak raw Liquid and
# markdown into the index. Running after :post_render means every document's
# `content` is final HTML, so the index is identical on every build.

require "json"

module SearchIndex
  BODY_LIMIT = 1200

  # Pages that exist for machines, or that would only ever match themselves.
  EXCLUDED_URLS = ["/404.html", "/search.html", "/search-index.json"].freeze
  EXCLUDED_EXTS = [".json", ".xml", ".txt", ".pdf"].freeze

  ENTITIES = {
    "&amp;" => "&", "&lt;" => "<", "&gt;" => ">", "&quot;" => '"',
    "&#39;" => "'", "&#8217;" => "’", "&nbsp;" => " "
  }.freeze

  def self.plain_text(html)
    text = html.to_s.dup
    # Drop anything whose text isn't prose before stripping the rest of the tags.
    text.gsub!(%r{<(script|style|svg)\b.*?</\1>}mi, " ")
    text.gsub!(/<[^>]+>/, " ")
    ENTITIES.each { |entity, char| text.gsub!(entity, char) }
    text.gsub!(/&#\d+;/, " ")
    text.strip.gsub(/\s+/, " ")
  end

  def self.truncate(text, limit)
    return text if text.length <= limit

    "#{text[0, limit].rstrip}…"
  end

  def self.skip?(url)
    return true if EXCLUDED_URLS.include?(url)

    EXCLUDED_EXTS.include?(File.extname(url))
  end

  def self.kind_for(item, url)
    return "Blog" if item.respond_to?(:collection) && item.collection&.label == "posts"
    return "Note" if item.respond_to?(:collection) && item.collection&.label == "notes"
    return "Project" if url.start_with?("/projects/")

    "Page"
  end

  def self.entry_for(item, site)
    url = item.url.to_s
    return nil if skip?(url)

    data = item.data
    title = data["title"]
    return nil if title.nil? || title.to_s.empty?
    return nil if data["sitemap"] == false && url != "/"

    date = data["date"]

    {
      "title" => title.to_s,
      "url" => File.join(site.baseurl.to_s, url),
      "kind" => kind_for(item, url),
      "date" => date.respond_to?(:strftime) ? date.strftime("%b %-d, %Y") : "",
      "tags" => [data["tags"], data["course"], data["chapter"], data["kicker"]]
                  .flatten.compact.join(" ").strip,
      "body" => truncate(plain_text(item.content), BODY_LIMIT)
    }
  end

  def self.build(site)
    items = site.documents + site.pages
    items.filter_map { |item| entry_for(item, site) }
         .sort_by { |entry| [entry["kind"], entry["title"].downcase] }
  end
end

Jekyll::Hooks.register :site, :post_render do |site|
  site.config["__search_index"] = SearchIndex.build(site)
end

Jekyll::Hooks.register :site, :post_write do |site|
  entries = site.config["__search_index"] || []
  path = File.join(site.dest, "search-index.json")

  FileUtils.mkdir_p(File.dirname(path))
  File.write(path, JSON.generate(entries))

  Jekyll.logger.info "Search index:", "#{entries.length} entries -> #{path}"
end
