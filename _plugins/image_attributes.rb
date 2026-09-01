# Adds loading/decoding hints and intrinsic width/height to every <img> in the
# rendered output. Intrinsic dimensions are what stop images from shifting the
# layout as they load (CLS); kramdown cannot emit them from markdown syntax, so
# we read them straight out of the image files here.
#
# Images that already declare `loading=` are left alone, which is how a page
# opts an above-the-fold image out of lazy loading (see the portrait on index).

module ImageAttributes
  # Cache per build — the same figure is often referenced from several pages.
  def self.dimensions_cache
    @dimensions_cache ||= {}
  end

  # Minimal header readers. Enough for the formats this site actually ships.
  def self.dimensions(path)
    return dimensions_cache[path] if dimensions_cache.key?(path)

    dims =
      begin
        File.open(path, "rb") { |io| read_dimensions(io) }
      rescue StandardError
        nil
      end

    dimensions_cache[path] = dims
  end

  def self.read_dimensions(io)
    head = io.read(32)
    return nil if head.nil? || head.bytesize < 24

    case
    when head.start_with?("\x89PNG\r\n\x1A\n".b)
      # IHDR width/height are the two big-endian u32s at offset 16.
      head[16, 8].unpack("N2")
    when head.start_with?("RIFF".b) && head[8, 4] == "WEBP".b
      webp_dimensions(head)
    when head.start_with?("\xFF\xD8".b)
      jpeg_dimensions(io)
    end
  end

  def self.webp_dimensions(head)
    case head[12, 4]
    when "VP8 ".b # lossy: 14-bit dimensions follow the 3-byte sync code
      [head[26, 2].unpack1("v") & 0x3FFF, head[28, 2].unpack1("v") & 0x3FFF]
    when "VP8L".b # lossless: 14-bit (width - 1), 14-bit (height - 1), packed
      bits = head[21, 4].unpack1("V")
      [(bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1]
    when "VP8X".b # extended: 24-bit little-endian (canvas - 1) values
      w = head[24, 3].bytes
      h = head[27, 3].bytes
      [(w[0] | (w[1] << 8) | (w[2] << 16)) + 1, (h[0] | (h[1] << 8) | (h[2] << 16)) + 1]
    end
  end

  def self.jpeg_dimensions(io)
    io.seek(2)
    while (marker = io.read(2))
      break unless marker.getbyte(0) == 0xFF

      code = marker.getbyte(1)
      length = io.read(2).unpack1("n")
      # SOF0..SOF15, excluding the non-frame markers DHT/JPG/DAC.
      if code >= 0xC0 && code <= 0xCF && ![0xC4, 0xC8, 0xCC].include?(code)
        # Skip the precision byte; the frame header stores height before width.
        height, width = io.read(5)[1, 4].unpack("n2")
        return [width, height]
      end
      io.seek(length - 2, IO::SEEK_CUR)
    end
    nil
  end

  # Resolve a src as it appears in the HTML back to a file in the source tree.
  def self.resolve(src, doc_url, site)
    return nil if src.nil? || src.empty?
    return nil if src.start_with?("http://", "https://", "//", "data:")

    baseurl = site.baseurl.to_s
    if src.start_with?("/")
      relative = src
      relative = relative.sub(/\A#{Regexp.escape(baseurl)}/, "") unless baseurl.empty?
      candidates = [File.join(site.source, relative)]
    else
      # Relative to the directory the document is published into. Collection
      # files (e.g. _notes/image-1.webp) ship alongside their documents.
      dir = File.dirname(doc_url.to_s)
      candidates = [
        File.join(site.source, dir, src),
        File.join(site.source, "_#{dir.split('/').reject(&:empty?).first}", src)
      ]
    end

    candidates.find { |c| File.file?(c) }
  end

  def self.process(content, doc_url, site)
    return content unless content.is_a?(String) && content.include?("<img")

    content.gsub(/<img\b([^>]*?)(\/?)>/i) do
      # Capture both groups up front: any further regex operation in this block
      # (including a plain =~) resets Regexp.last_match, so reading it later
      # would return the wrong match.
      attrs = Regexp.last_match(1)
      slash = Regexp.last_match(2)
      original = "<img#{attrs}#{slash}>"

      # An explicit loading= is how a page opts out (e.g. an LCP image).
      next original if attrs.match?(/\sloading\s*=/i)

      src = attrs[/\ssrc\s*=\s*["']([^"']+)["']/i, 1]
      added = +' loading="lazy" decoding="async"'

      unless attrs.match?(/\swidth\s*=/i) || attrs.match?(/\sheight\s*=/i)
        path = resolve(src, doc_url, site)
        if path && (dims = dimensions(path))
          added << %( width="#{dims[0]}" height="#{dims[1]}")
        end
      end

      "<img#{attrs.rstrip}#{added}#{slash.empty? ? '' : ' /'}>"
    end
  end
end

Jekyll::Hooks.register [:pages, :documents, :posts], :post_render do |doc|
  doc.output = ImageAttributes.process(doc.output, doc.url, doc.site)
end
