(function() {

  var monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june', 'july', 
    'august', 'september', 'october', 'november', 'december'];

  var dayNames = ['s', 'm', 't', 'w', 't', 'f', 's'];

  var isLeapYear = function(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  };

  var daysInMonth = function(date) {
    return [31, (isLeapYear(date.getYear()) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][date.getMonth()];
  };

  window.Backbone.UI.Calendar = Backbone.View.extend({
    options : {
      // the selected calendar date
      date : new Date(),

      // the day that weeks start on (0 is Sunday)
      weekStart : 0
    },

    initialize : function() {
      $(this.el).addClass('calendar');
    },

    render : function() {
      this._renderDate(new Date());

      return this;
    },

    _renderDate : function(date) {
      $(this.el).empty();

      var nextMonth = new Date(date);
      nextMonth.setMonth(date.getMonth() + 1);

      var lastMonth = new Date(date);
      lastMonth.setMonth(date.getMonth() - 1);

      var daysInPreviousMonth = daysInMonth(lastMonth);
      var daysInThisMonth = daysInMonth(date);
      var monthStart = (new Date(date.getFullYear(), date.getMonth(), 1).getDay());
      var weekOffset = this.options.weekStart - (monthStart < this.options.weekStart? 7 : 0);

      var daysRow = $.el.tr({className : 'row days'}); 

      var names = dayNames.slice(this.options.weekStart).concat(dayNames.slice(0, this.options.weekStart));
      for(var i=0; i<names.length; i++) {
        $.el.td(names[i]).appendTo(daysRow);
      }

      var tbody, table = $.el.table(
        $.el.thead(
          $.el.th(
            $.el.a({onclick : _(this._renderDate).bind(this, lastMonth)}, '<')),
          $.el.th({colspan : 5},
            $.el.div(monthNames[date.getMonth()])),
          $.el.th(
            $.el.a({onclick : _(this._renderDate).bind(this, nextMonth)}, '>'))),
        tbody = $.el.tbody(
          daysRow));

      var inactive = monthStart === 0, day = 0;
      for(var y=0; y<6 ; y++) {

        var row = $.el.tr({
          className : 'row' + (y === 0 ? ' first' : y === 4 ? ' last' : '')
        });

        for(var x=0; x<7; x++) {
          inactive = y === 0 && x < monthStart - 1 || day >= daysInThisMonth;
          if(!inactive) day++;

          //var isNextMonth = y
          $.el.td({
            className : 'cell' + (inactive ? ' inactive' : '')
          }, inactive ? '' : day).appendTo(row);
        }

        row.appendTo(tbody);
      }

      this.el.appendChild(table);
    }
  });
}());
