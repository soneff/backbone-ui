(function(){
  window.Backbone.UI.List = Backbone.UI.CollectionView.extend({
    options : {
      className : 'list',

      labelProperty : null,

      // exclusive of the labelProperty
      itemView : null,

      // A string, element, or function describing what should be displayed
      // when the list is empty.
      emptyContent : null,

      // A callback to invoke when a row is clicked.  If this callback
      // is present, the rows will highlight on hover.
      onItemClick : jQuery.noop
    },

    initialize : function() {
      Backbone.UI.CollectionView.prototype.initialize.call(this, arguments);
    },

    render : function() {
      $(this.el).empty();

      var list = $.el.ul();

      // if the collection is empty, we render the empty content
      if(!_(this.model).exists()  || this.model.length === 0) {
        var emptyContent = this.options.emptyContent;
        list.appendChild($.el.li(_(emptyContent).isFunction() ? emptyContent() : emptyContent));
      }

      // otherwise, we render each row
      else {
        _(this.model.models).each(function(model) {
          var content;
          if(_(this.options.itemView).exists()) {
            content = new this.options.itemView({
              model : model
            }).render().el;
          }
          else {
            content = this.resolveContent(null, model, this.options.labelProperty);
          }

          item = $.el.li(content).appendTo(list);

          // bind the item click callback if given
          if(this.options.onItemClick) {
            $(item).click(_(this.options.onItemClick).bind(this, model));
          }

          list.appendChild(item);
        }, this);
      }

      // wrap the list in a scroller
      var scroller = new Backbone.UI.Scroller({
        content : $.el.div(list)
      }).render();

      this.el.appendChild(scroller.el);

      return this;
    }
  });
})();
