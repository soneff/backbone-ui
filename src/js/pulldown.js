(function(){
  window.Backbone.UI.Pulldown = Backbone.View.extend({
    options : {
      // text to place in the pulldown button before a
      // selection has been made
      placeholder : 'Select...',

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
      this.mixin([Backbone.UI.HasGlyph]);
      $(this.el).addClass('pulldown');

      var onChange = this.options.onChange;
      delete(this.options.onChange);
      var menuOptions = _(this.options).extend({
        onChange : _(function(item){
          this._onItemSelected(item);
          if(_(onChange).isFunction()) onChange(item);
        }).bind(this)
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
        this.model.unbind('change', _(this.render).bind(this));
        
        // observe model changes
        if(_(this.options.content).exists()) {
          this.model.bind('change:' + this.options.content, _(this.render).bind(this));
        }
      }

      // observe collection changes
      if(_(this.options.alternatives).exists() && _(this.options.alternatives.bind).isFunction()) {
        this.options.alternatives.unbind('all', _(this.render).bind(this));
        this.options.alternatives.bind('all', _(this.render).bind(this));
      }
    },

    // public accessors 
    button : null,

    render : function() {
      $(this.el).empty();

      var item = this._menu.selectedItem;
      this.button = new Backbone.UI.Button({
        className  : 'pulldown_button',
        model      : {label : this._labelForItem(item)},
        content    : 'label',
        glyph      : _(item).resolveProperty(this.options.glyphProperty),
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
        _(item).resolveProperty(this.options.altLabelContent);
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
      if(!!this.button) {
        $(this.el).removeClass('placeholder');
        this.button.options.label = this._labelForItem(item);
        this.button.options.glyph = _(item).resolveProperty(this.options.glyphProperty);
        this.button.render();
        this.hideMenu();
      }
    },

    // notify of the menu hiding
    _onAutoHide : function() {
      if(this.options.onMenuHide) this.options.onMenuHide();
      return true;
    }
  });
}());
