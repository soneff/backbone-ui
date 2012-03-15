require 'rubygems'

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

  src = File.read('doc/src/index.html')

  lib_js = (Dir.glob('lib/required/**/*.js') +  Dir.glob('lib/optional/**/*.js')).map do |file|
    "<script src='#{file}'></script>"
  end
  src.gsub!('<!-- LIB_JS -->', lib_js.join("\n"))

  local_js = Dir.glob('src/**/*.js').map do |file|
    "<script src='#{file}'></script>"
  end
  src.gsub!('<!-- LOCAL_JS -->', local_js.join("\n"))

  lib_css = Dir.glob('lib/**/*.css').map do |file|
    "<link rel='stylesheet' href='#{file}'>"
  end
  src.gsub!('<!-- LIB_CSS -->', lib_css.join("\n"))

  local_css = Dir.glob('src/**/*.css').map do |file|
    "<link rel='stylesheet' href='#{file}'>"
  end
  src.gsub!('<!-- LOCAL_CSS -->', local_css.join("\n"))

  widgets = local_css = Dir.glob('doc/src/widgets/**/*.html').map do |file|
    File.read(file)
  end
  src.gsub!('<!-- WIDGETS -->', widgets.join("\n"))

  index = File.open('doc/dist/index.html', 'w') {|file| file.puts(src)}

  # copy src and lib directories over to documentation root
  `cp -r lib doc/dist/`
  `cp -r src doc/dist/`
  `cp -r doc/lib doc/dist/`
  `cp -r doc/src/images doc/dist/`
end
