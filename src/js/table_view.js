(function(){
  window.Backbone.UI.TableView = Backbone.UI.CollectionView.extend({
    options : {
      className : 'table_view',

      // each column should contain:
      //   label   : a string, element, or function describing the column's heading.
      //   width   : the width of the column in pixels.
      //   content : a string, element, or function describing the content
      //             that should be inserted in the column.  When a function
      //             is given, the function will be invoked with the row's model
      //             as the sole parameter.
      //   property : the name of the property the column's content should be bound
      //              to.  This option is mutually exclusive with the content option.
      columns : [],

      // A string, element, or function describing what should be displayed
      // when the table is empty.
      emptyContent : 'no entries',

      // A callback to invoke when a row is clicked.  If this callback
      // is present, the rows will highlight on hover.
      onItemClick : Backbone.UI.noop,

      maxHeight : null
    },

    initialize : function() {
      Backbone.UI.CollectionView.prototype.initialize.call(this, arguments);
      $(this.el).addClass('table_view');
    },

    render : function() {
      $(this.el).empty();
      this.itemViews = {};

      var container = $.el.div({className : 'content'},
        this.collectionEl = $.el.table());

      $(this.el).toggleClass('clickable', this.options.onItemClick !== Backbone.UI.noop);

      // generate a table row for our headings
      var headingRow = $.el.tr();
      _(this.options.columns).each(function(column, index, list) {

        var label = _(column.label).isFunction() ? column.label() : column.label;
        var width = !!column.width ? parseInt(column.width, 10) + 5 : null;
        var style = width ? 'width:' + width + 'px; max-width:' + width + 'px' : null;
        headingRow.appendChild($.el.th( 
          {className : _(list).nameForIndex(index), style : style}, 
          $.el.div({className : 'wrapper'}, label)));
      });

      // Add the heading row to it's very own table so we can allow the 
      // actual table to scroll with a fixed heading.
      this.el.appendChild($.el.table(
        {className : 'heading'}, 
        $.el.thead(headingRow)));

      // now we'll generate the body of the content table, with a row
      // for each model in the bound collection
      var tableBody = $.el.tbody();

      // if the collection is empty, we render the empty content
      // if the collection is empty, we render the empty content
      if(!_(this.model).exists()  || this.model.length === 0) {
        this._emptyContent = _(this.options.emptyContent).isFunction() ? 
          this.options.emptyContent() : this.options.emptyContent;
        this._emptyContent = $.el.tr($.el.td(this._emptyContent));

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
      if(this.options.enableScrolling) {
        var style = _(this.options.maxHeight).exists() ? 'max-height:' + this.options.maxHeight + 'px' : null;
        var scroller = new Backbone.UI.Scroller({
          content : $.el.div({style : style}, container) 
        }).render();

        this.el.appendChild(scroller.el);
      }
      else {
        this.el.appendChild(container);
      }

      this._updateClassNames();

      return this;
    },

    _renderItem : function(model, index) {
      var row = $.el.tr();

      // for each model, we walk through each column and generate the content 
      _(this.options.columns).each(function(column, index, list) {
        var width = !!column.width ? parseInt(column.width, 10) + 5 : null;
        var style = width ? 'width:' + width + 'px; max-width:' + width + 'px': null;
        var content = this.resolveContent(column.content, model, column.property);
        row.appendChild($.el.td(
          {className : _(list).nameForIndex(index), style : style}, 
          $.el.div({className : 'wrapper', style : style}, content)));
      }, this);

      // bind the item click callback if given
      if(this.options.onItemClick) {
        $(row).click(_(this.options.onItemClick).bind(this, model));
      }

      this.itemViews[model.cid] = row;
      return row;
    }
  });
})();

