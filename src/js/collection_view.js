(function(){
  window.Backbone.UI.CollectionView = Backbone.View.extend({
    _itemViews : {},

    // must be over-ridden to describe how an item is rendered
    _renderItem : jQuery.noop,

    initialize : function() {
      if(this.model) {
        this.model.bind('add', _.bind(this._onItemAdded, this));
        this.model.bind('change', _.bind(this._onItemChanged, this));
        this.model.bind('remove', _.bind(this._onItemRemoved, this));
        this.model.bind('refresh', _.bind(this.render, this));
      }
    },

    _onItemAdded : function(model, list, options) {
      var el = this._renderItem(model, list.indexOf(model));
      this.collectionEl.appendChild(el);
      // TODO insert at the proper index
    },

    _onItemChanged : function(model) {
      var view = this._itemViews[model.cid];
      if(!!view && view.el.parentNode) view.render();
      // TODO this may require re-sorting
    },

    _onItemRemoved : function(model) {
      var view = this._itemViews[model.cid];
      if(!!view && !!view.el.parentNode) view.el.parentNode.removeChild(view.el);
    }
  });
})();

