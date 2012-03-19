 // A mixin for dealing with collection alternatives
(function(){
  Backbone.UI.HasAlternativeProperty = {
    options : {
      // The collection of items representing alternative choices
      alternatives : null,

      // The property of the individual choice represent the the label to be displayed
      labelProperty : null,

      // The property of the individual choice that represents the value to be stored
      // in the bound model's property.  Omit this option if you'd like the choice 
      // object itself to represent the value.
      valueProperty : null
    },

    _determineSelectedItem : function() {
      var item;

      // if a bound property has been given, we attempt to resolve it
      if(_(this.model).exists() && _(this.options.property).exists()) {
        item = _(this.model).resolveProperty(this.options.property);

        // if a value property is given, we further resolve our selected item
        if(_(this.options.valueProperty).exists()) {
          var otherItem = _(this._collectionArray()).detect(function(collectionItem) {
            return (collectionItem.attributes || collectionItem)[this.options.valueProperty] === item;
          }, this);
          if(!_(otherItem).isUndefined()) item = otherItem;
        }
      }

      return item || this.options.selectedItem;
    },

    _setSelectedItem : function(item) {
      this.selectedValue = item;
      this.selectedItem = item;

      if(_(this.model).exists() && _(this.options.property).exists()) {
        this.selectedValue = this._valueForItem(item);
        _(this.model).setProperty(this.options.property, this.selectedValue);
      }
    },

    _valueForItem : function(item) {
      return _(this.options.valueProperty).exists() ? 
        _(item).resolveProperty(this.options.valueProperty) :
        item;
    },

    _collectionArray : function() {
      return _(this.options.alternatives).exists() ?
        this.options.alternatives.models || this.options.alternatives : [];
    },

    _observeCollection : function(callback) {
      if(_(this.options.alternatives).exists() && _(this.options.alternatives.bind).exists()) {
        var key = 'change';
        this.options.alternatives.unbind(key, callback);
        this.options.alternatives.bind(key, callback);
      }
    }
  };
}());

