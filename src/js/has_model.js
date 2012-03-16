 // A mixin for those views that are model bound
(function(){

  Backbone.UI.HasModel = {

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

