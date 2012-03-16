require 'rubygems'
require 'rkelly'

desc "build the backbone-ui-min.js file for distribution"
task :build => [:doc] do
  puts 'generating distribution'

  css_source_files = Dir.entries("./src/css").find_all do |source_file|
    source_file.match /\.css$/
  end
  File.open('dist/backbone-ui.css', 'w+') do |dev_file|
    css_source_files.each do |source_file|
      source = File.read './src/css/' + source_file
      dev_file.write source
    end
  end

  js_source_files = Dir.entries("./src/js").find_all do |source_file|
    source_file.match /\.js$/
  end

  File.open('dist/backbone-ui.js', 'w+') do |dev_file|
    js_source_files.each do |source_file|
      source = File.read './src/js/' + source_file
      dev_file.write source
    end
  end
end


desc "generate the documentation in doc/dist"
task :doc do 
  puts 'generating documentation'
  `rm -rf doc/dist/*`

  def build_script_tags(dirs)
    dirs.map do |dir|
      (Dir.glob("#{dir}/**/*.js")).map do |file|
        "<script src='./#{file}' type='text/javascript''></script>"
      end
    end
  end

  def build_css_tags(dirs)
    dirs.map do |dir|
      (Dir.glob("#{dir}/**/*.css")).map do |file|
        "<link rel='stylesheet' type='text/css' href='./#{file}'>"
      end
    end
  end

  def collect_option_comments(js)
    parser = RKelly::Parser.new
    ast = parser.parse(js);

    options_node = nil
    ast.each do |node|
      if node.kind_of? RKelly::Nodes::PropertyNode and node.name == 'options'
        options_node = node.value
        break
      end
    end

    options = {}
    comments = []
    options_node.each do |node|
      if node.kind_of? RKelly::Nodes::PropertyNode
        if comments.length > 0
          options[node.name] = comments.flatten.join
          comments = []
        end
      end
      comments << node.comments.map { |comment| comment.value.gsub(/^\/\//, '') }
    end

    options
  end

  src = File.read('doc/src/index.html')

  # insert script and style tags
  src.gsub!('<!-- JS -->', build_script_tags(['lib/required', 'lib/optional', 'src/js']).join("\n"))
  src.gsub!('<!-- CSS -->', build_css_tags(['lib', 'src/css']).join("\n"))

  # insert widgets and their associated option comments
  widgets = Dir.glob('doc/src/widgets/**/*.html').map do |file|

    name = file[(file.rindex('/') + 1)..-1]
    name = name[0..(name.rindex '.') -1]
    name = "src/js/#{name}.js"

    map = collect_option_comments(File.read(name))
    map.keys.sort

    options_markup = map.keys.sort.map do |key|
      "<li>#{key}:#{map[key]}</li>"
    end
    options_markup = "<div class='options'><h2>Options</h2><ul>#{options_markup.join}</ul></div>"

    content = File.read(file)
    content.gsub!('<!-- OPTIONS -->', options_markup)

    content
  end
  src.gsub!('<!-- WIDGETS -->', widgets.join("\n"))

  index = File.open('doc/dist/index.html', 'w') {|file| file.puts(src)}

  # copy src and lib directories over to documentation root
  `cp -r lib doc/dist/`
  `cp -r src doc/dist/`
  `cp -r doc/lib doc/dist/`
  `cp -r doc/src/images doc/dist/`
end

task :insert_scripts do

end
