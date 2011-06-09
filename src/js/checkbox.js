(function(){
  window.Backbone.UI.Checkbox = Backbone.View.extend({

    options : {
      tagName : 'a',
      className : 'checkbox',
      model : null,
      property : null,
      label : null,
      checked : false,
      onClick : null
    },

    initialize : function() {
      $(this.el).click(_(this._onClick).bind(this));
      $(this.el).attr({href : '#'});
      $(this.el).addClass('checkbox');

      if(_(this.model).exists() && _(this.options.property).exists()) {
        this.model.bind('change:' + this.options.property, _.bind(function() {
          this.checked = !this.checked;
          this.render();
        }, this));
      }

      if(_(this.model).exists() && _(this.options.labelProperty).exists()) {
        this.model.bind('change:' + this.options.labelProperty, _.bind(function() {
          this.render();
        }, this));
      }
    },

    render : function() {
      this.checked = 
        _(this.model).exists() && _(this.options.property).exists() ? 
        _(this.model).resolveProperty(this.options.property) : 
        _(this.checked).exists() ? this.checked : 
        _(this.options.checked).exists() ? this.options.checked : false;

      $(this.el).empty();

      var mark = $.el('div', {className : 'checkmark'});
      if(this.checked) {
        mark.appendChild($.el('div', {className : 'checkmark_fill'}));
      }

      var labelText = _(this.options.label).exists() ? 
        this.options.label : 
        _(this.model).exists() && _(this.options.labelProperty).exists() ?
        _(this.model).resolveProperty(this.options.labelProperty) : '';

      this._label = $.el('div', {className : 'label'}, labelText);

      this.el.appendChild(mark);
      this.el.appendChild(this._label);
      this.el.appendChild($.el('br', {style : 'clear:both'}));

      return this;
    },

    _onClick : function() {
      this.checked = !this.checked;
      if(_(this.model).exists() && _(this.options.property).exists()) {
        _(this.model).setProperty(this.options.property, this.checked);
      }
      else {
        this.render();
      }
      return false;
    }
  });
})();
