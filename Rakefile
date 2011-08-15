require 'rubygems'
require 'yui/compressor'

desc "build the backbone-ui-min.js file for distribution"
task :build do
  begin
    require 'closure-compiler'
  rescue LoadError
    puts "closure-compiler not found.\nInstall it by running 'gem install closure-compiler"
    exit
  end

  css_source_files = Dir.entries("./src/css").find_all do |source_file|
    source_file.match /\.css$/
  end
  css_compressor = YUI::CssCompressor.new
  File.open('dist/backbone-ui.css', 'w+') do |dev_file|
    #File.open('dist/backbone-ui-min.css', 'w+') do |min_file|
      css_source_files.each do |source_file|
        source = File.read './src/css/' + source_file
        #min_file.write css_compressor.compress(source)
        dev_file.write source
      end
    #end
  end

  js_source_files = Dir.entries("./src/js").find_all do |source_file|
    source_file.match /\.js$/
  end
  closure = Closure::Compiler.new

  File.open('dist/backbone-ui.js', 'w+') do |dev_file|
    #File.open('dist/backbone-ui-min.js', 'w+') do |min_file|
      js_source_files.each do |source_file|
        source = File.read './src/js/' + source_file
        #min_file.write closure.compress(source)
        dev_file.write source
      end
    #end
  end
end

desc "run JavaScriptLint on the source"
task :lint do
  system "jsl -nofilelisting -nologo -conf docs/jsl.conf -process backbone.js"
end
