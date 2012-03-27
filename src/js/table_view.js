(function(){
  window.Backbone.UI.TableView = Backbone.UI.CollectionView.extend({
    options : {
      // Each column should contain a <code>label</code> property to
      // describe the column's heading, a <code>content</code> property to
      // declare which property the cell is bound to, an optional two-argument
      // <code>comparator</code> with which to sort each column if the
      // table is sortable, and an optional <code>width</code> property to
      // declare the width of the column in pixels.
      columns : [],

      // A string, element, or function describing what should be displayed
      // when the table is empty.
      emptyContent : 'no entries',

      // A callback to invoke when a row is clicked.  If this callback
      // is present, the rows will highlight on hover.
      onItemClick : Backbone.UI.noop,

      // Clicking on the column headers will sort the table. See
      // <code>comparator</code> property description on columns.
      sortable : false,

      // A callback to invoke when the table is to be sorted. The callback will
      // be passed the <code>column</code> on which to sort.
      onSort : Backbone.UI.noop
    },

    initialize : function() {
      Backbone.UI.CollectionView.prototype.initialize.call(this, arguments);
      $(this.el).addClass('table_view');
      this._sortState = {};
    },

    render : function() {
      $(this.el).empty();
      this.itemViews = {};

      var container = $.el.div({className : 'content'},
        this.collectionEl = $.el.table());

      $(this.el).toggleClass('clickable', this.options.onItemClick !== Backbone.UI.noop);

      // generate a table row for our headings
      var headingRow = $.el.tr();
      _(this.options.columns).each(_(function(column, index, list) {

        var label = _(column.label).isFunction() ? column.label() : column.label;
        var width = !!column.width ? parseInt(column.width, 10) + 5 : null;
        var style = width ? 'width:' + width + 'px; max-width:' + width + 'px; ' : '';
        style += this.options.sortable ? 'cursor: pointer; ' : '';
        column.comparator = _(column.comparator).isFunction() ? column.comparator : function(item1, item2) {
          return item1.get(column.content) < item2.get(column.content) ? -1 :
            item1.get(column.content) > item2.get(column.content) ? 1 : 0;
        };
        var sortLabel = this._sortState.content === column.content ? (this._sortState.reverse ? '\u25b2 ' : '\u25bc ') : '';
        var onclick = this.options.sortable ? (this.options.onSort === Backbone.UI.noop ?
          _(function() { this._sort(column); }).bind(this) :
          _(function() { this.options.onSort(column)}).bind(this)) : Backbone.UI.noop;
        headingRow.appendChild($.el.th(
          {className : _(list).nameForIndex(index), style : style, onclick : onclick},
          $.el.div({className : 'wrapper'}, sortLabel + label)));
      }).bind(this));

      // Add the heading row to it's very own table so we can allow the
      // actual table to scroll with a fixed heading.
      this.el.appendChild($.el.table(
        {className : 'heading'},
        $.el.thead(headingRow)));

      // now we'll generate the body of the content table, with a row
      // for each model in the bound collection
      var tableBody = $.el.tbody();

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
      if(_(this.options.maxHeight).exists()) {
        var style = 'max-height:' + this.options.maxHeight + 'px';
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
        var content = this.resolveContent(model, column.content);
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
    },

    _sort : function(column) {
      this._sortState.reverse = !this._sortState.reverse;
      this._sortState.content = column.content;
      comp = column.comparator;
      if (this._sortState.reverse) {
        comp = function(item1, item2) {
          return -column.comparator(item1, item2);
        };
      }
      this.model.comparator = comp;
      this.model.sort();
    }
  });
}());

