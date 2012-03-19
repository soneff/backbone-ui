 // A mixin for those views that are model bound
(function(){
  Backbone.UI.HasModel = {
    
    options : {
      // The Backbone.Model instance the view is bound to
      model : null,

      // The property of the bound model this component should render / update
      property : null
    },

    _observeModel : function(callback) {
      if(_(this.model).exists() && _(this.model.unbind).isFunction()) {
        _(['property', 'labelProperty', 'valueProperty']).each(function(prop) {
          var key = this.options[prop];
          if(_(key).exists()) {
            key = 'change:' + key;
            this.model.unbind(key, callback);
            this.model.bind(key, callback);
          }
        }, this);
      }
    }
  };
}());

