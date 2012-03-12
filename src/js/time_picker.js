(function(){
  window.Backbone.UI.TimePicker = Backbone.View.extend({

    options : {
      // a moment.js format : http://momentjs.com/docs/#/display/format
      format : 'hh:mm a',

      // minute interval to use for pulldown menu
      interval : 30,

      name : null
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
      document.body.appendChild(this._menu.el);


      // listen for model changes
      if(!!this.model && this.options.property) {
        this.model.bind('change:' + this.options.property, _(this.render).bind(this));
      }
    },

    render : function() {
      $(this.el).empty();

      this._textField = new Backbone.UI.TextField({
        name : this.options.name 
      }).render();
      $(this._textField.input).click(_(this._showMenu).bind(this));
      $(this._textField.input).keyup(_(this._timeEdited).bind(this));
      this.el.appendChild(this._textField.el);

      var date = (!!this.model && !!this.options.property) ? 
        _(this.model).resolveProperty(this.options.property) : null;
      
      if(!!date) {
        this._textField.setValue(moment(date).format(this.options.format));
        this._selectedTime = date;
      }

      this._menu.options.collection = this._collectTimes();
      this._menu.options.selectedValue = date;
      this._menu.render();
      
      return this;
    },

    setEnabled : function(enabled) {
      this._textField.setEnabled(enabled);
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
      this._timeEdited();
    },

    _timeEdited : function(e) {
      var newDate = moment(this._textField.getValue(), this.options.format);

      // if the enter key was pressed or we've invoked this method manually, 
      // we hide the calendar and re-format our date
      if(!e || e.keyCode == Backbone.UI.KEYS.KEY_RETURN) {
        this._textField.setValue(moment(newDate).format(this.options.format));
        this._hideMenu();

        // update our bound model (but only the date portion)
        if(!!this.model && this.options.property) {
          var boundDate = _(this.model).resolveProperty(this.options.property);
          boundDate.setHours(newDate.hours());
          boundDate.setMinutes(newDate.minutes());
        }
      }
    }
  });
}());
