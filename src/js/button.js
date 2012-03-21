(function(){
  window.Backbone.UI.Button = Backbone.View.extend({
    options : {
      tagName : 'a',

      // true will disable the button
      // (muted non-clickable) 
      disabled : false,

      // true will activate the button
      // (depressed and non-clickable)
      active : false,

      hasBorder : true,

      // A callback to invoke when the button is clicked
      onClick : null,

      // renders this button as an input type=submit element as opposed to an anchor.
      isSubmit : false
    },

    initialize : function() {
      this.mixin([Backbone.UI.HasModel, Backbone.UI.HasGlyph]);

      _(this).bindAll('render');

      $(this.el).addClass('button');

      // if we're running in a mobile environment, the 'click' event 
      // isn't quite translated correctly
      if(document.ontouchstart !== undefined || document.ontouchstart === null) {
        $(this.el).bind('touchstart', _(function(e) {
          $(this.el).addClass('active');

            Backbone.UI._activeButton = this;
            var bodyUpListener = $(document.body).bind('touchend', function(e) {
              if(Backbone.UI._activeButton) {
                if(e.target === Backbone.UI._activeButton.el || $(e.target).closest('.button.active').length > 0) {
                  if(Backbone.UI._activeButton.options.onClick) Backbone.UI._activeButton.options.onClick(e); 
                }
                $(Backbone.UI._activeButton.el).removeClass('active');
              }

              Backbone.UI._activeButton = null;
              $(document.body).unbind('touchend', bodyUpListener);
            });

          return false;
        }).bind(this));
      }

      else {
        $(this.el).bind('click', _(function(e) {
          if(!this.options.disabled && !this.options.active && this.options.onClick) {
            this.options.onClick(e); 
          }
          return false;
        }).bind(this));
      }
    },

    render : function() {
      var labelText = _(this.model).resolveProperty(this.options.content);

      this._observeModel(this.render);

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
      this.setEnabled(!this.options.disabled);
      this.setActive(this.options.active);

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
    },

    // sets the active state of the button
    setActive : function(active) {
      this.options.active = active;
      $(this.el)[active ? 'addClass' : 'removeClass']('active');
    }
  });
}());

