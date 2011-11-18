(function(){
  window.Backbone.UI.CollectionView = Backbone.View.extend({
    itemViews : {},
    _emptyContent : null,

    // must be over-ridden to describe how an item is rendered
    _renderItem : Backbone.UI.noop,

    initialize : function() {
      if(this.model) {
        this.model.bind('add', _.bind(this._onItemAdded, this));
        this.model.bind('change', _.bind(this._onItemChanged, this));
        this.model.bind('remove', _.bind(this._onItemRemoved, this));
        this.model.bind('refresh', _.bind(this.render, this));
      }
    },

    _onItemAdded : function(model, list, options) {
      // first check if we've already rendered an item for this model
      if(!!this.itemViews[model.cid]) {
        return;
      }

      // remove empty content if it exists
      if(!!this._emptyContent) {
        if(!!this._emptyContent.parentNode) this._emptyContent.parentNode.removeChild(this._emptyContent);
        this._emptyContent = null;
      }
       
      // render the new item
      var el = this._renderItem(model, list.indexOf(model));

      // insert it into the DOM position that matches it's position in the model
      var properIndex = list.indexOf(model);
      this.collectionEl.insertBefore(el, this.collectionEl.childNodes[properIndex]);

      // update the first / last class names
      this._updateClassNames();

      // notify that a change to the collection view has occurred
      if(this.options.onChange) this.options.onChange();
    },

    _onItemChanged : function(model) {
      var view = this.itemViews[model.cid];
      if(!!view && view.el && view.el.parentNode) view.render();
      if(this.options.onChange) this.options.onChange();

      // TODO this may require re-sorting
    },

    _onItemRemoved : function(model) {
      var view = this.itemViews[model.cid];
      var liOrTrElement = view.el.parentNode;
      if(!!view && !!liOrTrElement && !!liOrTrElement.parentNode) {
        liOrTrElement.parentNode.removeChild(liOrTrElement);
      }
      delete(this.itemViews[model.cid]);

      // update the first / last class names
      this._updateClassNames();

      if(this.options.onChange) this.options.onChange();
    },

    _updateClassNames : function() {
      var children = this.collectionEl.childNodes;
      if(children.length > 0) {
        _(children).each(function(child) {
          $(child).removeClass('first');
          $(child).removeClass('last');
        });
        $(children[0]).addClass('first');
        $(children[children.length - 1]).addClass('last');
      }
    }
  });
})();

