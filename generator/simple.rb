require 'yaml'
require 'arbre'

categories = YAML.load_file('../_data/offset.yml')

html = Arbre::Context.new do
  meta charset: 'utf-8'
  link href: 'simple.css', type: 'text/css', rel: 'stylesheet'

  categories.each do |c|
    cc = []

    c['formats'].each do |f|
      f['chromaticities'].each do |ch|
        ch['paper_types'].each do |pt|
          pt['copyCount'].each do |count, price|
            cc << count
          end
        end
      end
    end

    cc.uniq!
    cc.sort!

    h1 c['name']

    table do
      tr do
        td
        cc.each { |v| td v, class: 'price' }
      end

      c['formats'].each do |f|
        tr do
          td f['name'], class: 'name'
          cc.each { td }
        end

        f['chromaticities'].each do |ch|
          tr do
            td ch['name'], style: 'padding-left: 20px'
            cc.each { td }
          end

          ch['paper_types'].each do |pt|
            tr do
              td pt['name'], style: 'padding-left: 40px'

              cc.each do |td_count|
                value = pt['copyCount'].find { |count, price| count == td_count }
                td value && value[1] || '-', class: 'price'
              end
            end
          end
        end
      end
    end

    div class: 'break'
  end
end

puts html.to_s
