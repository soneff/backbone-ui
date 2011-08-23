(function(){
  window.Backbone.UI.CollectionView = Backbone.View.extend({

    initialize : function() {
      if(this.model) {
        this.model.bind('add', _.bind(this._onModelAdded, this));
        this.model.bind('change', _.bind(this._onModelChanged, this));
        this.model.bind('remove', _.bind(this._onModelRemoved, this));
        this.model.bind('refresh', _.bind(this.render, this));
      }
      this._itemViews = {};
    },

    _onModelAdded : function(model, list, options) {
      this.render();
    },

    _onModelChanged : function(model) {
      var view = this._itemViews[model.cid];
      if(!!view) view.render();
    },

    _onModelRemoved : function() {
      this.render();
    }
  });
})();

