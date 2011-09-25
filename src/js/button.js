(function(){
  window.Backbone.UI.Button = Backbone.View.extend({
    options : {
      tagName : 'a',

      className : 'button',

      // the text displayed on the button
      label : null,

      // true will disable the button
      // (muted non-clickable) 
      disabled : false,

      // true will activate the button
      // (depressed and non-clickable)
      active : false,

      // glyph to display to the left of the label
      glyph : null,

      // glyph to display to the right of the label
      glyphRight : null,

      hasBorder : true,

      // A callback to invoke when the button is clicked
      onClick : null,

      isSubmit : false
    },

    initialize : function() {
      _.extend(this, Backbone.UI.HasGlyph);

      _.bindAll(this, 'render');

      $(this.el).addClass('button');

      if(document.ontouchstart !== undefined || document.ontouchstart === null) {

        $(this.el).bind('touchstart', _(function(e) {
          $(this.el).addClass('active');
        }).bind(this));

        $(this.el).bind('touchend', _(function(e) {
          $(this.el).removeClass('active');
        }).bind(this));
      }

      else {
        $(this.el).mousedown(_.bind(function(e) {
          $(this.el).addClass('active');
        }, this));

        $(this.el).mouseup(_.bind(function(e) {
          $(this.el).removeClass('active');
        }, this));
      }

      $(this.el).click(_.bind(function(e) {
        if(!this.options.active && !this.options.disabled) {
          if(this.options.onClick) this.options.onClick(e); 
        }
        return false;
      }, this));
    },

    render : function() {
      var labelText = this.options.label;

      if(_(this.model).exists() && _(this.options.property).exists()) {
        var key = 'change:' + this.options.property;
        this.model.unbind(key, this.render);
        this.model.bind(key, this.render);
        labelText = _(this.model).resolveProperty(this.options.property);
      }

      $(this.el).empty();
      $(this.el).toggleClass('has_border', this.options.hasBorder);

      if(this.options.isSubmit) {
        $.el.input({
          type : 'submit',
          value : ''
        }).appendTo(this.el);
      }

      // insert label
      $.el.span({
        className : 'label'
      }, labelText).appendTo(this.el);

      // insert glyphs
      this.insertGlyph(this.el, this.options.glyph);
      this.insertGlyphRight(this.el, this.options.glyphRight);

      // add appropriate class names
      $(this.el).toggleClass('no_label', !this.options.label);
      this.setEnabled(!this.options.disabled);
      this.setActive(this.options.active);

      return this;
    },

    // sets the enabled state of the button
    setEnabled : function(enabled) {
      enabled ? this.el.href = '#' : this.el.removeAttribute('href');
      this.options.disabled = !enabled;
      $(this.el)[enabled ? 'removeClass' : 'addClass']('disabled');
    },

    // sets the active state of the button
    setActive : function(active) {
      this.options.active = active;
      $(this.el)[active ? 'addClass' : 'removeClass']('active');
    }
  });
})();

