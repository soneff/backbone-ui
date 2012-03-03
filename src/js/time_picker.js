(function(){
  window.Backbone.UI.TimePicker = Backbone.View.extend({

    options : {
      // a moment.js format : http://momentjs.com/docs/#/display/format
      format : 'hh:mm'
    },

    initialize : function() {
      $(this.el).addClass('time_picker');

      this._textField = new Backbone.UI.TextField({
      }).render();
    },

    render : function() {
      $(this.el).empty();
      
      return this;
    }
  });
}());
