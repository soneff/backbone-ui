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

  // task example
  var taskFunc = function() {
    var TaskView = Backbone.View.extend({
      render : function() {

        $(this.el).empty();

        this.el.appendChild(new Backbone.UI.Checkbox({
          model : this.model,
          labelContent : 'title',
          content : 'done'
        }).render().el);
      }
    });

    var field = new Backbone.UI.TextField({
      model : this.model
    }).render();

    var button = new Backbone.UI.Button({
      content : 'add task',
      onClick : function() {
        var value = field.getValue();
        if(value.length > 0) {
          list.options.model.add({
            title : field.getValue(),
            checked : false 
          });
          field.setValue('');
        }
      }
    }).render();

    var list = new Backbone.UI.List({
      itemView : TaskView,
      model : new Backbone.Collection([], {
        comparator : function(task) {
          return task.get('done');
        }
      })
    }).render();

    var app = $.el.div(field.el, button.el, list.el);

    return app; 
  };

  var code = js_beautify(taskFunc.toString(), {
    indent_size : 2 
  });

  $.el.pre(code).appendTo($('#task_list_code')[0]);

  var result = taskFunc();
  $('#task_list_result')[0].appendChild(result);
});

