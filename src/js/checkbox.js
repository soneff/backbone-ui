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

      // observe property changes
      if(_(this.model).exists() && _(this.options.property).exists()) {
        // TODO this key should be based on the last set property, not the new one.
        // This will leak an observer if we dont keep track of previously bound keys 
        var key = 'change:' + this.options.property;
        this.model.unbind(key, this.render);
        this.model.bind(key, this.render);
        this.checked = _(this.model).resolveProperty(this.options.property);
      }

      // observe label property changes
      if(_(this.model).exists() && _(this.options.labelProperty).exists()) {
        var labelKey = 'change:' + this.options.labelProperty;
        this.model.unbind(labelKey, this.render);
        this.model.bind(labelKey, this.render);
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
