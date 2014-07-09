require 'yaml'

categories = YAML.load_file('../_data/souvenir.yml')

categories.each do |c|
  c['formats'].each do |f|
    f['chromaticities'].each do |ch|
      ch['paper_types'].each do |pt|
        pt['copyCount'] = pt['copyCount'].map { |count, price| [count, (price.to_i * 3).to_i] }
      end
    end
  end
end

File.write '../_data/souvenir.yml', categories.to_yaml
