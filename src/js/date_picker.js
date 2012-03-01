(function(){
  window.Backbone.UI.DatePicker = Backbone.View.extend({
    options : {
    },

    initialize : function() {
      $(this.el).addClass('date_picker');

      this._textField = new Backbone.UI.TextField({
      }).render();

      this._calendar = new Backbone.UI.Calendar({
        onSelect : _(this._selectDate).bind(this)
      }).render();

      $(this._textField.input).click(_(this._showCalendar).bind(this));
      $(this._textField.input).keyup(_(this._dateEdited).bind(this));
    },

    render : function() {
      $(this.el).empty();
      $(this._calendar.el).hide();

      this.el.appendChild(this._textField.el);
      this.el.appendChild(this._calendar.el);
      
      return this;
    },

    _showCalendar : function() {
      $(this._calendar.el).show();
    },

    _selectDate : function(date) {
      var month = date.getMonth() + 1;
      if(month < 10) month = '0' + month;

      var day = date.getDate();
      if(day < 10) day = '0' + day;

      var dateString = date.getFullYear() + '-' + month + '-' + day;
      this._textField.setValue(dateString);
      $(this._calendar.el).hide();
    },

    _dateEdited : function() {

    }
  });
}());
