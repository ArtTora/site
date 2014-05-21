require 'yaml'
require 'arbre'

categories = YAML.load_file('../_data/offset.yml')

html = Arbre::Context.new do
  meta charset: 'utf-8'
  link href: 'beautiful.css', type: 'text/css', rel: 'stylesheet'

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

    h1 do
     span c['name']
     div class: 'first'
     div class: 'second'
    end

    c['formats'].each do |f|
      div class: 'one' do
        h2 f['name']

        f['chromaticities'].each do |ch|
          h3 ch['name']

          ch['paper_types'].each_slice(2).to_a.each do |list|
            table class: 'invisible', width: '100%' do
              list.each do |pt|
                td width: '50%', class: 'block' do
                  h4 pt['name']

                  table class: 'copy-count', width: '100%' do
                    tr do
                      td 'Тираж'
                      td 'Цена'
                      td 'Срок изголовления'
                    end

                    pt['copyCount'].each do |count, price|
                      tr do
                        td count
                        td price
                        td 'от 3 до 5 раб. д.'
                      end
                    end
                  end
                end
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
