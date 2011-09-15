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
    },

    render : function() {
      $(this.el).empty();

      $(this.el).toggleClass('clickable', this.options.onItemClick !== Backbone.UI.noop);

      // generate a table row for our headings
      var headingRow = $.el.tr();
      _(this.options.columns).each(function(column, index, list) {
        var width = column.width ? column.width : index == list.length -1 ? null : 150;
        if(width && index === 0) width += 5; 
        var label = _(column.label).isFunction() ? column.label() : column.label;
        var style = width ? 'width:' + width + 'px' : null;
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
      if(this.model.length === 0) {
        var emptyContent = this.options.emptyContent;
        tableBody.appendChild($.el.tr(
          {colspan : this.options.columns.length}, 
          _(emptyContent).isFunction() ? emptyContent() : emptyContent));
      }

      // otherwise, we render each row
      else {
        this.model.each(function(m) {
          var row = $.el.tr();

          // for each model, we walk through each column and generate the content 
          _(this.options.columns).each(function(column, index, list) {
            var width = column.width ? column.width : index == list.length -1 ? null : 150;
            var style = width ? 'width:' + width + 'px' : null;
            var content = this.resolveContent(column.content, m, column.property);
            row.appendChild($.el.td(
              {className : _(list).nameForIndex(index), style : style}, 
              $.el.div({className : 'wrapper'}, content)));
          }, this);

          // bind the item click callback if given
          if(this.options.onItemClick) {
            $(row).click(_(this.options.onItemClick).bind(this, m));
          }

          tableBody.appendChild(row);
        }, this);
      }

      this._collectionView = $.el.table();
      this._collectionView.appendChild(tableBody);

      // wrap the table in a scroller
      var style = _(this.options.maxHeight).exists() ? 'max-height:' + this.options.maxHeight + 'px' : null;
      var scroller = new Backbone.UI.Scroller({
        content : $.el.div({style : style}, this._collectionView)
      }).render();

      this.el.appendChild(scroller.el);

      this._updateClassNames();

      return this;
    }
  });
})();
