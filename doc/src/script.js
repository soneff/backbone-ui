window.beautify = function(func) {
  var code = func.toString();
  code = code.substring(code.indexOf('\n'));
  code = code.substring(0, code.lastIndexOf('return'));
  code = code.replace(/var lorem = \"[^\"]*"/, 'var lorem = "Lorem ipsum dolor sit..."');
  code = js_beautify(code, {
    indent_size : 2 
  });
  return code;
};

window.addExample = function(container, func) {
  // remove function wrapper and return statement 
  // from the code, then format it
  var code = beautify(func);

  var example = $.el.div(
    $.el.div({className : 'code'}, 
      $.el.pre({className : 'prettyprint'}, code)),
    $.el.div({className : 'result'}, 
      func().el),
    $.el.br({style : 'clear:both'}));
    
    $(container)[0].insertBefore(example, $('.options', $(container)[0])[0]);
};

$(window).load(function() {

  // setup sample data
  setTimeout(prettyPrint, 0);

  var func = function() {
    window.regions = new Backbone.Collection([{
      name : 'Americas',
      notes : 'Bright'
    }, {
      name : 'Africa',
      notes : 'Fruity'
    }]);

    window.coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic : true,
      region : regions.at(0)
    });

    return;
  };

  func();

  $.el.pre(beautify(func)).appendTo($('#setup_code')[0]);

  // keep example state display data updated
  var dataEl = $('#example_data')[0];
  $(dataEl).hide();
  var stateEl = $('#example_state')[0];
  var renderState = function() {
    $(stateEl).empty();
    var json = (JSON.stringify(coffee.attributes, null, 2));
    json = json.substring(json.indexOf('\n')).substring(0, json.lastIndexOf('\n'));
    $.el.pre(json).appendTo(stateEl);

    if(!$(dataEl).is(":visible")) {
      $(dataEl).fadeIn();
    }
  };

  var closeLink = $('#close_example')[0];
  $(closeLink).click(function() {
    $(dataEl).fadeOut();
    return false;
  });

  coffee.bind('change', renderState);
  regions.bind('change', renderState);
});
