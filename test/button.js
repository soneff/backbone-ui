$(document).ready(function() {

  module("Backbone.UI.Button");

  test("basic", function() {
    var model = new Backbone.Model({
      foo : 'bar'
    });

    var button = new Backbone.UI.Button({
      model : model,
      labelProperty : 'foo'
    }).render();

    var text = $(button.el).find('.label').text();
    equals(text, 'bar');

    model.set({foo : 'baz'});
    text = $(button.el).find('.label').text();
    equals(text, 'baz');
  });
});

