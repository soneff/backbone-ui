(function(){
  window.Backbone.UI.Pulldown = Backbone.View.extend({
    options : {
      className : 'pulldown',

      // text to place in the pulldown button before a
      // selection has been made
      placeholder : 'Select...',

      model : null,

      property : null,

      // The initially selected item.  This option is ignored when a 
      // model and property are given.
      selectedItem : null,

      // the collection of objects this pulldown will choose from.
      // Use the 'labelProperty' option to declare which property
      // of each object should be used as the label.  Similary, 
      // use the 'glyphProperty' and 'glyphRightProperty' to 
      // declare which properties should be used as the right
      // and left glyph.
      collection : [],

      // The collection item property describing the label.
      labelProperty : 'label',

      // The collection item property describing the value to be
      // stored in the model's bound property.  If no valueProperty
      // is given, the actual collection item will be used.
      valueProperty : null,

      // When given, an associated entry will be rendered at the 
      // top of the pulldown allowing the user to enter a new 
      // entry as a selection.
      newModel : null,

      // This model represents an empty or default selection that
      // will be placed at the top of the pulldown
      emptyModel : null,

      glyphProperty : null,

      glyphRightProperty : null,

      // If true, the menu will be aligned to the right side
      alignRight : false,

      // A callback to invoke with a particular item when that item is
      // selected from the pulldown menu.
      onChange : Backbone.UI.noop,

      // A callback to invoke when the pulldown menu is shown, passing the 
      // button click event.
      onMenuShow : Backbone.UI.noop,

      // A callback to invoke when the pulldown menu is hidden, if the menu was hidden
      // as a result of a second click on the pulldown button, the button click event 
      // will be passed.
      onMenuHide : Backbone.UI.noop
    },

    initialize : function() {
      _(this).extend(Backbone.UI.HasGlyph);
      _(this).extend(Backbone.UI.HasCollectionProperty);
      _(this).bindAll('render');
      $(this.el).addClass('pulldown');
    },

    // public accessors 
    button : null,
    menu : null,
    selectedItem : null,

    render : function() {
      $(this.el).empty();

      // observe model changes
      if(_(this.model).exists() && _(this.model.bind).isFunction()) {
        this.model.unbind('change', this.render);
        
        // observe model changes
        if(_(this.options.property).exists()) {
          this.model.bind('change:' + this.options.property, this.render);
        }
      }

      // observe collection changes
      if(_(this.options.collection).exists() && _(this.options.collection.bind).isFunction()) {
        this.options.collection.unbind('all', this.render);
        this.options.collection.bind('all', this.render);
      }

      this._renderMenu();

      this.selectedItem = this._determineSelectedItem() || this.options.selectedItem;

      this.button = new Backbone.UI.Button({
        className : 'pulldown_button',
        label : this._labelForItem(this.selectedItem),
        glyph : _(this.selectedItem).resolveProperty(this.options.glyphProperty),
        glyphRight : '\u25bc',
        onClick : _.bind(this._onPulldownClick, this)
      }).render();
      this.el.appendChild(this.button.el);

      return this;
    },

    setEnabled : function(enabled) {
      if(this.button) this.button.setEnabled(enabled);
    },

    _labelForItem : function(item) {
      return !_(item).exists() ? this.options.placeholder : 
        _(item).resolveProperty(this.options.labelProperty);
    },

    // sets the selected item
    setSelectedItem : function(item) {
      this._setSelectedItem(item);
      this.button.options.label = this._labelForItem(item);
      this.button.options.glyph = _(item).resolveProperty(this.options.glyphProperty);
      this.button.render();
    },

    // Forces the menu to hide
    hideMenu : function(event) {
      $(this._scroller.el).hide();
      if(this.options.onMenuHide) this.options.onMenuHide(event);
    },
    
    //forces the menu to show
    showMenu : function(e) {
      var anchor = this.button.el;
      var showOnTop = $(window).height() - ($(anchor).offset().top - document.body.scrollTop) < 150;
      var position = (this.options.alignRight ? '-right' : '-left') + (showOnTop ? 'top' : ' bottom');
      $(this._scroller.el).alignTo(anchor, position, 0, 1);
      $(this._scroller.el).show();
      $(this._scroller.el).autohide({
        ignoreKeys : [Backbone.UI.KEYS.KEY_UP, Backbone.UI.KEYS.KEY_DOWN], 
        ignoreInputs : true,
        hideCallback : _.bind(this._onAutoHide, this)
      });
      $(this._scroller.el).css({width : Math.max($(this.button.el).innerWidth(), this._menuWidth)});
      if(this.options.onMenuShow) this.options.onMenuShow(e);
      this._scroller.setScrollRatio(0);
    },

    // Renders the menu entries based on the current options
    _renderMenu : function() {
      // clear the existing menu
      if(this._scroller) {
        this._scroller.el.parentNode.removeChild(this._scroller.el);
        $(this._scroller.el).css({width : 'auto'});
      }
      
      // create a new list of items
      var list = $.el.ul({className : 'pulldown_menu'});

      if(_(this.options.newModel).exists()) {
        var newLabel = this._labelForItem(this.options.newModel) || "";
        var newAnchor = $.el.a({href : '#'}, $.el.span(newLabel));
        $(newAnchor).click(_(this._onAddNewItem).bind(this));
        list.appendChild($.el.li({className : 'new_item'}, newAnchor));
      }

      var emptyModel = this.options.emptyModel;
      if(_(emptyModel).exists()) {
        var emptyLabel = this._labelForItem(emptyModel);
        var emptyAnchor = $.el.a({href : '#'}, $.el.span(emptyLabel));
        $(emptyAnchor).click(_.bind(function() {
          this._setSelectedItem(null);
          this.hideMenu();
          this._updateButtonWithItem(emptyModel);
          if(this.options.onChange) this.options.onChange(emptyModel);
          return false;
        }, this));
        list.appendChild($.el.li({className : 'new_item'}, emptyAnchor));
      }

      var collection = _(this.options.collection).exists() ?
        this.options.collection.models || this.options.collection : [];

      _(collection).each(function(item) {
        this._addItemToMenu(list, item);
      }, this);

      // wrap them up in a scroller that's added to the document body
      this._scroller = new Backbone.UI.Scroller({
        content : list
      }).render();
      $(this._scroller.el).hide();
      // Prevent scroll events from percolating out to the enclosing doc
      $(this._scroller.el).bind('mousewheel', function(){return false;});
      $(this._scroller.el).addClass('pulldown_menu_scroller');
      // Optionally decorate the menu with the owning pulldown's class name
      if (this.options.className) {
        $(this._scroller.el).addClass('pulldown_menu_scroller_for_' + this.options.className);
      }

      document.body.appendChild(this._scroller.el);
      this._menuWidth = $(this._scroller.el).width() + 20;
    },

    // Adds the given pulldown item (creating a new li element) 
    // to the given menu ul element
    _addItemToMenu : function(menu, item) {
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

      $(anchor).bind('click', _.bind(function(e) {
        this.hideMenu();
        this._setSelectedItem(item);
        this._updateButtonWithItem(item);
        if(this.options.onChange) this.options.onChange(item);
        return false;
      }, this));

      menu.appendChild(liElement);
    },

    _updateButtonWithItem : function(item) {
      $(this.el).removeClass('placeholder');
      this.button.options.label = this._labelForItem(item);
      this.button.options.glyph = _(item).resolveProperty(this.options.glyphProperty);
      this.button.render();
    },

    _onAddNewItem : function(e) {
      var newItem = this.options.newModel;
      var oldValue = this._labelForItem(newItem);
      _(newItem).setProperty(this.options.labelProperty, '');
      this._setSelectedItem(newItem);
      if(this.options.onChange) this.options.onChange(newItem);

      this.hideMenu();
      $(this.el).removeClass('placeholder');

      this._newItemText = $.ui('TextField', {
        className : 'new_item_text',
        model : newItem,
        property : this.options.labelProperty
      }).render();

      this._cancelNewItemButton = $.ui('Button', {
        className : 'new_item_cancel',
        label : '\u2716',
        onClick : _(this._onCancelNewItem).bind(this, oldValue)
      }).render();

      this.el.appendChild(this._newItemText.el);
      this.el.appendChild(this._cancelNewItemButton.el);
      this._newItemText.input.focus();

      $(this.button.el).css({visibility : 'hidden'});

      return false;
    },

    _onCancelNewItem : function(oldValue) {
      _(this.options.newModel).setProperty(this.options.labelProperty, oldValue);
      this._setSelectedItem(null);
      var textEl = this._newItemText.el;
      if(_(textEl).exists() && textEl.parentNode) {
        textEl.parentNode.removeChild(textEl);
      }

      var cancelEl = this._cancelNewItemButton.el;
      if(_(cancelEl).exists() && cancelEl.parentNode) {
        cancelEl.parentNode.removeChild(cancelEl);
      }
      $(this.button.el).css({visibility : 'visible'});
      this.render();
    },

    //shows/hides the pulldown menu when the button is clicked
    _onPulldownClick : function(e) {
      $(this._scroller.el).is(':visible') ? this.hideMenu(e) : this.showMenu(e); 
    },

    // notify of the menu hiding
    _onAutoHide : function() {
      if(this.options.onMenuHide) this.options.onMenuHide();
      return true;
    }
  });
})();
