(function(){
  window.Backbone.UI.Checkbox = Backbone.View.extend({

    options : {
      tagName : 'a',
      label : null,
      checked : false,
      /** 
       * A function that will be called with the new checked
       * state after the checked state has been toggled.
       */
      onChanged : null,
      /**
       * Called with no arguments whenever the Checkbox is clicked
       * regardless of the enabled state.
       */
      onClick : null,
      /**
       * If set to false, the Checkbox will not automatically toggle
       * its state.
       */
      enabled : true
    },

    initialize : function() {
      _(this).extend(Backbone.UI.HasModel);
      _(this).bindAll('render');

      $(this.el).click(_(this._onClick).bind(this));
      $(this.el).attr({href : '#'});
      $(this.el).addClass('checkbox');
    },

    render : function() {

      this._observeModel(this.render);

      $(this.el).empty();

      this.checked = this.checked || _(this.model).resolveProperty(this.options.property);
      var mark = $.el.div({className : 'checkmark'});
      if(this.checked) {
        mark.appendChild($.el.div({className : 'checkmark_fill'}));
      }

      var labelText = _(this.model).resolveProperty(this.options.labelProperty);
      this._label = $.el.div({className : 'label'}, labelText);

      this.el.appendChild(mark);
      this.el.appendChild(this._label);
      this.el.appendChild($.el.br({style : 'clear:both'}));

      return this;
    },

    _onClick : function() {
      if (this.options.onClick) {
        this.options.onClick();
      }
      if (!this.options.enabled) {
        return false;
      }
      this.checked = !this.checked;
      if(_(this.model).exists() && _(this.options.property).exists()) {
        _(this.model).setProperty(this.options.property, this.checked);
      }
      else {
        this.render();
      }
      if (this.options.onChanged) {
        this.options.onChanged(this.checked);
      }
      return false;
    }
  });
}());
