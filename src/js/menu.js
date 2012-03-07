(function(){
  window.Backbone.UI.Menu = Backbone.View.extend({

    options : {
      // The collection item property describing the label.
      labelProperty : 'label',

      onChange : null,

      selectedValue : null
    },

    initialize : function() {
      $(this.el).addClass('menu');
      _(this).extend(Backbone.UI.HasCollectionProperty);

      this._textField = new Backbone.UI.TextField({
      }).render();
    },

    scroller : null,

    render : function() {
      $(this.el).empty();

      // clear the existing menu
      if(this.scroller) {
        this.scroller.el.parentNode.removeChild(this.scroller.el);
        $(this.scroller.el).css({width : 'auto'});
      }
      
      // create a new list of items
      var list = $.el.ul();

      // add entry for the empty model if it exists
      if(!!this.options.emptyModel) {
        this._addItemToMenu(list, this.options.emptyModel);
      }

      var collection = _(this.options.collection).exists() ?
        this.options.collection.models || this.options.collection : [];

      _(collection).each(function(item) {
        var select = !!this.options.selectedValue && 
          _(item.value).isEqual(this.options.selectedValue);

        this._addItemToMenu(list, item, select);
      }, this);

      // wrap them up in a scroller 
      this.scroller = new Backbone.UI.Scroller({
        content : list
      }).render();

      // Prevent scroll events from percolating out to the enclosing doc
      $(this.scroller.el).bind('mousewheel', function(){return false;});
      $(this.scroller.el).addClass('menu_scroller');

      this.el.appendChild(this.scroller.el);
      this._menuWidth = $(this.scroller.el).width() + 20;
      
      return this;
    },

    scrollToSelectedItem : function() {
      if(!this._selectedAnchor) return;

      var pos = $(this._selectedAnchor.parentNode).position().top - 10;
      this.scroller.setScrollPosition(pos);
    },

    // Adds the given item (creating a new li element) 
    // to the given menu ul element
    _addItemToMenu : function(menu, item, select) {
      var anchor = $.el.a({href : '#'}, 
        $.el.span(this._labelForItem(item) || '\u00a0'));

      var glyph;
      if(this.options.glyphProperty) {
        glyph = _(item).resolveProperty(this.options.glyphProperty);
        Backbone.UI.HasGlyph.insertGlyph(anchor, glyph);
      }

      if(this.options.glyphRightProperty) {
        glyph = _(item).resolveProperty(this.options.glyphRightProperty);
        Backbone.UI.HasGlyph.insertGlyphRight(anchor, glyph);
      }

      var liElement = $.el.li(anchor);

      var clickFunction = _.bind(function(e) {
        if(!!this._selectedAnchor) $(this._selectedAnchor).removeClass('selected');

        this._setSelectedItem(item === this.options.emptyModel ? null : item);
        this._selectedAnchor = anchor;
        $(anchor).addClass('selected');

        if(this.options.onChange) this.options.onChange(item);
        return false;
      }, this);

      $(anchor).click(clickFunction);

      if(select) clickFunction();

      menu.appendChild(liElement);
    },

    _labelForItem : function(item) {
      return !_(item).exists() ? this.options.placeholder : 
        _(item).resolveProperty(this.options.labelProperty);
    }
  });
}());
