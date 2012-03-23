(function(){
  window.Backbone.UI.Link = Backbone.View.extend({
    options : {
      tagName : 'a',

      // disables the link (non-clickable) 
      disabled : false,

      // A callback to invoke when the link is clicked
      onClick : null
    },

    initialize : function() {
      this.mixin([Backbone.UI.HasModel, Backbone.UI.HasGlyph]);

      _(this).bindAll('render');

      $(this.el).addClass('link');

      $(this.el).bind('click', _(function(e) {
        if(!this.options.disabled && this.options.onClick) {
          this.options.onClick(e); 
        }
        return false;
      }).bind(this));
    },

    render : function() {
      var labelText = this.resolveContent();

      this._observeModel(this.render);

      $(this.el).empty();

      // insert label
      $.el.span({
        className : 'label'
      }, labelText).appendTo(this.el);

      // insert glyphs
      this.insertGlyph(this.el, this.options.glyph);
      this.insertGlyphRight(this.el, this.options.glyphRight);

      // add appropriate class names
      this.setEnabled(!this.options.disabled);

      return this;
    },

    // sets the enabled state of the button
    setEnabled : function(enabled) {
      if(enabled) {
        this.el.href = '#';
      } else { 
        this.el.removeAttribute('href');
      }
      this.options.disabled = !enabled;
      $(this.el)[enabled ? 'removeClass' : 'addClass']('disabled');
    }
  });
}());

