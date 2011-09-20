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

      // If true, the contents will be placed inside of a UI.Scroller
      enableScrolling : false, 

      // A callback to invoke when a row is clicked.  If this callback
      // is present, the rows will highlight on hover.
      onItemClick : Backbone.UI.noop
    },

    initialize : function() {
      Backbone.UI.CollectionView.prototype.initialize.call(this, arguments);
    },

    render : function() {
      $(this.el).empty();

      this.collectionEl = $.el.ul();

      // if the collection is empty, we render the empty content
      if(!_(this.model).exists()  || this.model.length === 0) {
        this._emptyContent = _(this.options.emptyContent).isFunction() ? 
          this.options.emptyContent() : this.options.emptyContent;

        if(!!this._emptyContent) {
          this.collectionEl.appendChild($.el.li(this._emptyContent));
        }
      }

      // otherwise, we render each row
      else {
        _(this.model.models).each(function(model, index) {
          var item = this._renderItem(model, index);
          this.collectionEl.appendChild(item);
        }, this);
      }

      // wrap the list in a scroller
      if(this.options.enableScrolling) {
        var scroller = new Backbone.UI.Scroller({
          content : $.el.div(this.collectionEl) 
        }).render();

        this.el.appendChild(scroller.el);
      }
      else {
        this.el.appendChild(this.collectionEl);
      }

      this._updateClassNames();

      return this;
    },

    // renders an item for the given model, at the given index
    _renderItem : function(model, index) {
      var content;
      if(_(this.options.itemView).exists()) {
        var view = new this.options.itemView({
          model : model
        }).render();
        this._itemViews[model.cid] = view;
        content = view.el;
      }
      else {
        content = this.resolveContent(null, model, this.options.labelProperty);
      }

      item = $.el.li(content);

      // bind the item click callback if given
      if(this.options.onItemClick) {
        $(item).click(_(this.options.onItemClick).bind(this, model));
      }

      return item;
    }
  });
})();

