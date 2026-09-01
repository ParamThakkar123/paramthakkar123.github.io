# Decides, per page, whether highlight.js and KaTeX need to be loaded at all.
#
# Previously every page pulled both in — roughly 170 KB of JS plus a
# render-blocking CSS request on pages like /achievements.html that contain
# neither code nor math. head.html now reads the `needs_code` / `needs_math`
# flags this sets. A page can still force either on with `code: true` or
# `math: true` in its front matter.

module AssetNeeds
  # Fenced blocks, or a literal <pre>/<code> in embedded HTML.
  CODE = /^[ \t]*(?:```|~~~)|<pre\b|<code\b/m.freeze

  # $$...$$ display math, \(...\), \[...\], or single-$ inline math. The last
  # form requires a non-space directly after the opening $ so that prose about
  # money doesn't drag in KaTeX.
  MATH = /\$\$|\\\(|\\\[|\$(?![\s$])[^\n$]{1,200}\$/m.freeze

  def self.scan(doc)
    source = doc.content.to_s

    doc.data["needs_code"] = true if doc.data["needs_code"].nil? && source.match?(CODE)
    doc.data["needs_math"] = true if doc.data["needs_math"].nil? && source.match?(MATH)
  end
end

Jekyll::Hooks.register [:pages, :documents, :posts], :pre_render do |doc|
  AssetNeeds.scan(doc)
end
