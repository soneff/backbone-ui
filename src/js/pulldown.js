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
      $(this.el).addClass('pulldown');

      var menuOptions = _(this.options).extend({
        onChange : _(this._onItemSelected).bind(this)
      });

      this._menu = new Backbone.UI.Menu(menuOptions).render();
      $(this._menu.el).autohide({
        ignoreKeys : [Backbone.UI.KEYS.KEY_UP, Backbone.UI.KEYS.KEY_DOWN], 
        ignoreInputs : false,
        hideCallback : _.bind(this._onAutoHide, this)
      });
      $(this._menu.el).hide();
      document.body.appendChild(this._menu.el);

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
    },

    // public accessors 
    button       : null,
    selectedItem : null,

    render : function() {
      $(this.el).empty();

      this.selectedItem = this._determineSelectedItem() || this.options.selectedItem;

      this.button = new Backbone.UI.Button({
        className  : 'pulldown_button',
        label      : this._labelForItem(this.selectedItem),
        glyph      : _(this.selectedItem).resolveProperty(this.options.glyphProperty),
        glyphRight : '\u25bc',
        onClick    : _.bind(this.showMenu, this)
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
      $(this._menu.el).hide();
      if(this.options.onMenuHide) this.options.onMenuHide(event);
    },
    
    //forces the menu to show
    showMenu : function(e) {
      var anchor = this.button.el;
      var showOnTop = $(window).height() - ($(anchor).offset().top - document.body.scrollTop) < 150;
      var position = (this.options.alignRight ? '-right' : '-left') + (showOnTop ? 'top' : ' bottom');
      $(this._menu.el).alignTo(anchor, position, 0, 1);
      $(this._menu.el).show();
      $(this._menu.el).css({width : Math.max($(this.button.el).innerWidth(), this._menuWidth)});
      if(this.options.onMenuShow) this.options.onMenuShow(e);
      this._menu.scrollToSelectedItem();
    },

    _onItemSelected : function(item) {
      $(this.el).removeClass('placeholder');
      this.button.options.label = this._labelForItem(item);
      this.button.options.glyph = _(item).resolveProperty(this.options.glyphProperty);
      this.button.render();
      this.hideMenu();
    },

    // notify of the menu hiding
    _onAutoHide : function() {
      if(this.options.onMenuHide) this.options.onMenuHide();
      return true;
    }
  });
}());
