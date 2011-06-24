$(document).ready(function() {

  module("Backbone.UI.Button");

  test("withoutDataBinding", function() {
    var button = new Backbone.UI.Button({
      label : 'foo'
    }).render();

    var text = $(button.el).find('.label').text();
    equals(text, 'foo');
  });

  test("withDataBinding", function() {
    var model = new Backbone.Model({
      foo : 'bar'
    });

    var button = new Backbone.UI.Button({
      model : model,
      property : 'foo'
    }).render();

    // text should be based on 'foo' property
    var text = $(button.el).find('.label').text();
    equals(text, 'bar');

    // update the foo property
    model.set({foo : 'baz'});

    // text should have changed
    text = $(button.el).find('.label').text();
    equals(text, 'baz');
  });

  test("submitType", function() {
    var button = new Backbone.UI.Button({
      label : 'foo',
      isSubmit : true
    }).render();

    var inputs = $(button.el).find('input[type=submit]');
    equals(inputs.length, 1);
  });
});
