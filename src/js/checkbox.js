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
      _.bindAll(this, 'render');
      $(this.el).click(_(this._onClick).bind(this));
      $(this.el).attr({href : '#'});
      $(this.el).addClass('checkbox');
    },

    render : function() {
      this.checked = 
        _(this.checked).exists() ? this.checked : 
        _(this.options.checked).exists() ? this.options.checked : false;
      var labelText = this.options.label;

      if(_(this.model).exists()) {
        this.model.unbind(null, this.render);
      }

      // observe property changes
      if(_(this.model).exists() && _(this.options.property).exists()) {
        this.model.bind('change:' + this.options.property, _(this.render).bind(this));
        this.checked = _(this.model).resolveProperty(this.options.property);
      }

      // observe label property changes
      if(_(this.model).exists() && _(this.options.labelProperty).exists()) {
        this.model.bind('change:' + this.options.labelProperty, _(this.render).bind(this));
        labelText = _(this.model).resolveProperty(this.options.labelProperty);
      }

      $(this.el).empty();

      var mark = $.el('div', {className : 'checkmark'});
      if(this.checked) {
        mark.appendChild($.el('div', {className : 'checkmark_fill'}));
      }

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
