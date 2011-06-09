(function(){
  window.Backbone.UI.RadioGroup = Backbone.View.extend({

    options : {
      className : 'radio_group',

      // each item can contain :
      collection : [],

      model : null,

      property : null,

      // A property of the collection item that describes the label.
      labelProperty : 'label',

      // The name of a collection item property describing the value to be
      // stored in the model's bound property.  If no valueProperty
      // is given, the actual collection item will be used.
      valueProperty : null,

      // The initially selected item.  This option is ignored when a 
      // model and property are given
      selectedItem : null,

      // A callback to invoke with the selected item whenever the selection changes
      onChange : jQuery.noop
    },

    initialize : function() {
      _.extend(this, Backbone.UI.HasCollectionProperty);
      _.extend(this, Backbone.UI.HasGlyph);
      $(this.el).addClass('radio_group');
    },

    // public accessors
    selectedItem : null,

    render : function() {
      this.selectedItem = this._determineSelectedItem();

      $(this.el).empty();

      var ul = $.el('ul');
      _.each(this.options.collection, function(item) {

        var selected = this.selectedValue == this._valueForItem(item);

        var label = _(item).resolveProperty(this.options.labelProperty);
        
        var li = $.el('li', [$.el('a', {className : 'choice', href : '#'}, [
            $.el('div', {className : 'mark'}, selected ? '\u25cf' : ''),
            $.el('div', {className : 'label'}, label),
            $.el('br', {style : 'clear:both'})
          ]), $.el('br', {style : 'clear:both'})]);
        ul.appendChild(li);

        $(li).bind('click', _.bind(this._onChange, this, item));
        
      }, this);
      this.el.appendChild(ul);

      return this;
    },

    _onChange : function(item) {
      this._setSelectedItem(item);
      this.render();

      if(_(this.options.onChange).isFunction()) this.options.onChange(item);
      return false;
    }
  });
})();
