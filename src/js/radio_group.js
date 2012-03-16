(function(){
  window.Backbone.UI.RadioGroup = Backbone.View.extend({

    options : {
      // A callback to invoke with the selected item whenever the selection changes
      onChange : Backbone.UI.noop
    },

    initialize : function() {
      _(this).extend(Backbone.UI.HasModel);
      _(this).extend(Backbone.UI.HasGlyph);
      _(this).extend(Backbone.UI.HasCollectionProperty);
      _(this).bindAll('render');
      $(this.el).addClass('radio_group');
    },

    // public accessors
    selectedItem : null,

    render : function() {

      $(this.el).empty();

      this._observeModel(this.render);
      this._observeCollection(this.render);

      this.selectedItem = this._determineSelectedItem();

      var ul = $.el.ul();
      var selectedValue = this._valueForItem(this.selectedItem);
      _(this._collectionArray()).each(function(item) {

        var selected = selectedValue === this._valueForItem(item);

        var label = _(item).resolveProperty(this.options.labelProperty);
        
        var li = $.el.li(
          $.el.a({className : 'choice' + (selected ? ' selected' : '')},
            $.el.div({className : 'mark' + (selected ? ' selected' : '')}, 
              selected ? '\u25cf' : ''),
            $.el.div({className : 'label'}, label)));
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
}());
