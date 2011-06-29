$(document).ready(function() {

  module("Backbone.UI.Checkbox");

  test("withoutDataBinding", function() {
    var checkbox = new Backbone.UI.Checkbox({
      label : 'foo',
      checked : true
    }).render();

    var text = $(checkbox.el).find('.label').text();
    equals(text, 'foo');

    var mark = $(checkbox.el).find('.checkmark_fill');
    equals(1, mark.length);

    checkbox = new Backbone.UI.Checkbox({
      label : 'foo',
      checked : false 
    }).render();

    mark = $(checkbox.el).find('.checkmark_fill');
    equals(0, mark.length);
  });

  test("withDataBinding", function() {
    var model = new Backbone.Model({
      description : 'property name',
      active : true 
    });

    var checkbox = new Backbone.UI.Checkbox({
      model : model,
      property : 'active',
      labelProperty : 'description'
    }).render();

    // label should be rendered from the 'descripton' property
    var text = $(checkbox.el).find('.label').text();
    equals(text, 'property name');

    // checkmark should be active based on the 'active' property
    var mark = $(checkbox.el).find('.checkmark_fill');
    equals(1, mark.length);

    // update our model
    model.set({
      description : 'baz',
      active : false
    });

    // text should have changed
    text = $(checkbox.el).find('.label').text();
    equals(text, 'baz');

    // and we should now have a checkmark fill
    mark = $(checkbox.el).find('.checkmark_fill');
    equals(0, mark.length);
  });
});
