require 'yaml'

categories = YAML.load_file('../_data/offset_dump.yml')

categories.each do |c|
  c['formats'].each do |f|
    f['chromaticities'].each do |ch|
      ch['paper_types'].each do |pt|
        pt['copyCount'] = pt['copyCount'].map { |count, price| [count, (price.to_i + price.to_i * 0.1).to_i] }
      end
    end
  end
end

File.write '../_data/offset.yml', categories.to_yaml
