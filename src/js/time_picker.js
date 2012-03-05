(function(){
  window.Backbone.UI.TimePicker = Backbone.View.extend({

    options : {
      // a moment.js format : http://momentjs.com/docs/#/display/format
      format : 'hh:mm a',

      // minute interval to use for pulldown menu
      interval : 30
    },

    initialize : function() {
      $(this.el).addClass('time_picker');

      this._menu = new Backbone.UI.Menu({
        onChange : _(this._onSelectTimeItem).bind(this)
      });
      $(this._menu.el).hide();
      $(this._menu.el).autohide({
        ignoreInputs : true
      });

      this._textField = new Backbone.UI.TextField({}).render();
      $(this._textField.input).click(_(this._showMenu).bind(this));
    },

    render : function() {
      $(this.el).empty();
      this.el.appendChild(this._textField.el);

      this._menu.options.collection = this._collectTimes();
      this._menu.render();
      this.el.appendChild(this._menu.el);
      
      return this;
    },

    _collectTimes : function() {
      var collection = [];
      var d = moment().sod();
      var day = d.date();

      while(d.date() === day) {
        collection.push({
          label : d.format(this.options.format),
          value : new Date(d)
        });

        d.add('minutes', this.options.interval);
      }

      return collection;
    },

    _showMenu : function() {
      $(this._menu.el).alignTo(this._textField.el, 'bottom -left', 0, 2);
      $(this._menu.el).show();
      this._menu.scrollToSelectedItem();
    },

    _hideMenu : function() {
      $(this._menu.el).hide();
    },

    _onSelectTimeItem : function(item) {
      this._hideMenu();
      this._selectedTime = moment(item.value);
      this._textField.setValue(this._selectedTime.format(this.options.format));
    }
  });
}());
