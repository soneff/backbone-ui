(function(){
  window.Backbone.UI.TextArea = Backbone.View.extend({
    options : {
      className : 'text_area',

      model : null,
      property : null,

      // id to use on the actual textArea 
      textAreaId : null,

      // disables the text area
      disabled : false,
      
      enableScrolling : true,

      // value for the text area
      value : null,

      tabIndex : null 
    },

    // public accessors
    textArea : null,

    initialize : function() {
      this.mixin([Backbone.UI.HasGlyph, Backbone.UI.HasModel]);
      $(this.el).addClass('text_area');
    },

    render : function() {
      var value = (this.textArea && this.textArea.value.length) > 0 ? 
        this.textArea.value : !_(this.options.value).isNull() ? this.options.value : 
        (!!this.model && !!this.options.property) ? 
        _(this.model).resolveProperty(this.options.property) : null;

      $(this.el).empty();

      this.textArea = $.el.textarea({
        id : this.options.textAreaId,
        tabIndex : this.options.tabIndex, 
        placeholder : this.options.placeholder}, value);

      var content = this.textArea;
      if(this.options.enableScrolling) {
        this._scroller = new Backbone.UI.Scroller({
          content : this.textArea
        }).render();
        content = this._scroller.el;
      }

      this.insertGlyphRight(this.el, this.options.glyphRight);
      this.el.appendChild(content);
      this.insertGlyph(this.el, this.options.glyph);

      this.setEnabled(!this.options.disabled);

      $(this.textArea).keyup(_.bind(function() {
        _.defer(_(this._updateModel).bind(this));
      }, this));

      return this;
    },

    getValue : function() {
      return this.textArea.value;
    },

    setValue : function(value) {
      $(this.textArea).empty();
      this.textArea.value = value;
      this._updateModel();
    },

    // sets the enabled state
    setEnabled : function(enabled) {
      if(enabled) {
        $(this.el).removeClass('disabled');
      } else {
        $(this.el).addClass('disabled');
      }
      this.textArea.disabled = !enabled;
    },

    _updateModel : function() {
      _(this.model).setProperty(this.options.property, this.textArea.value);
    }
  });
}());
