(function(){
  window.Backbone.UI.List = Backbone.UI.CollectionView.extend({
    options : {
      // A Backbone.View implementation describing how to render a particular 
      // item in the collection.  For simple use cases, you can pass a String 
      // instead which will be interpreted as the property of the model to display.
      itemView : null
    },

    initialize : function() {
      Backbone.UI.CollectionView.prototype.initialize.call(this, arguments);
      $(this.el).addClass('list');
    },

    render : function() {
      $(this.el).empty();
      this.itemViews = {};

      this.collectionEl = $.el.ul();

      // if the collection is empty, we render the empty content
      if(!_(this.model).exists()  || this.model.length === 0) {
        this._emptyContent = _(this.options.emptyContent).isFunction() ? 
          this.options.emptyContent() : this.options.emptyContent;
        this._emptyContent = $.el.li(this._emptyContent);

        if(!!this._emptyContent) {
          this.collectionEl.appendChild(this._emptyContent);
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
      if(_(this.options.maxHeight).exists()) {
        var style = 'max-height:' + this.options.maxHeight + 'px';
        var scroller = new Backbone.UI.Scroller({
          content : $.el.div({style : style}, this.collectionEl) 
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

        if(_(this.options.itemView).isString()) {
          content = this.resolveContent(model, this.options.itemView);
        }

        else {
          var view = new this.options.itemView({
            model : model
          });
          view.render();
          this.itemViews[model.cid] = view;
          content = view.el;
        }
      }

      var item = $.el.li(content);

      // bind the item click callback if given
      if(this.options.onItemClick) {
        $(item).click(_(this.options.onItemClick).bind(this, model));
      }

      return item;
    }
  });
}());

