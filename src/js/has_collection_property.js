 // A mixin for dealing with glyphs in widgets 
(function(){
  Backbone.UI.HasCollectionProperty = {

    collection : [],

    selectedItem : null,

    selectedValue : null,

    _determineSelectedItem : function() {
      var item;

      // if a bound property has been given, we attempt to resolve it
      if(_(this.model).exists() && _(this.options.property).exists()) {
        item = _(this.model).resolveProperty(this.options.property);

        // if a value property is given, we further resolve our selected item
        if(_(this.options.valueProperty).exists()) {
          var collection = this.options.collection.models || this.options.collection;
          var otherItem = _(collection).detect(function(collectionItem) {
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
    }
  };
}());

