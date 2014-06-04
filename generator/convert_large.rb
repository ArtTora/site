require 'yaml'

categories = YAML.load_file('../_data/large.yml')

categories.each do |c|
  c['resolutions'].each do |r|
    r['price_per_unit'] = r['price_per_unit'] * 3

    r['options'].each do |o|
      o['price_per_unit'] = o['price_per_unit'] * 3
    end if r['options']
  end
end

File.write '../_data/large.yml', categories.to_yaml
