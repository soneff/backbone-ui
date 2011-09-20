(function(){
  window.Backbone.UI.TextField = Backbone.View.extend({
    options : {
      className : 'text_field',

      model : null,

      property : null,

      // disables the input text
      disabled : false,
      
      // The type of input (text or password)
      type : 'text',

      // the value to use for both the name and id attribute 
      // of the underlying input element
      name : null,

      // value for the input
      value : null,

      label : null,

      tabIndex : null,

      onKeyPress : Backbone.UI.noop
    },

    // public accessors
    input : null,

    initialize : function() {
      _.extend(this, Backbone.UI.HasGlyph);

      this.input = $.el.input();

      $(this.input).keyup(_.bind(function(e) {
        _.defer(_(this._updateModel).bind(this));
        if(_(this.options.onKeyPress).exists() && _(this.options.onKeyPress).isFunction()) {
          this.options.onKeyPress(e);
        }
      }, this));

      if(!!this.model && this.options.property) {
        this.model.bind('change:' + this.options.property, _.bind(function() {
          var newValue = this.model.get(this.options.property);
          if(this.input && this.input.value != newValue) this.input.value = this.model.get(this.options.property);
        }, this));
      }
    },

    render : function() {
      var value = (this.input && this.input.value.length) > 0 ? 
        this.input.value : !_(this.options.value).isNull() ? this.options.value : 
        (!!this.model && !!this.options.property) ? 
        _(this.model).resolveProperty(this.options.property) : null;

      $(this.el).empty();
      $(this.el).addClass('text_field');

      $(this.input).attr({
        type : this.options.type ? this.options.type : 'text',
        name : _(this.options.name).safeString(),
        id : _(this.options.name).safeString(),
        tabIndex : this.options.tabIndex,
        placeholder : _(this.options.placeholder).safeString(),
        value : _(value).safeString()});

      this.insertGlyphRight(this.el, this.options.glyphRight);
      this.el.appendChild($.el.div({className : 'input_wrapper'}, this.input));
      this.insertGlyph(this.el, this.options.glyph);

      this.setEnabled(!this.options.disabled);

      if(this.options.label) {
        $(this.options.label).attr({'for' : this.options.name});
      }
      
      return this;
    },

    getValue : function() {
      return this.input.value;
    },

    setValue : function(value) {
      this.input.value = value;
      this._updateModel();
    },

    // sets the enabled state
    setEnabled : function(enabled) {
      enabled ? $(this.el).removeClass('disabled') : $(this.el).addClass('disabled');
      this.input.disabled = !enabled;
    },

    _updateModel : function() {
      _(this.model).setProperty(this.options.property, this.input.value);
    }
  });
})();

