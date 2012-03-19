(function() {

  var monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  var dayNames   = ['s', 'm', 't', 'w', 't', 'f', 's'];

  var isLeapYear = function(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  };

  var daysInMonth = function(date) {
    return [31, (isLeapYear(date.getYear()) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][date.getMonth()];
  };

  var formatDateHeading = function(date) {
    return monthNames[date.getMonth()] + ' ' + date.getFullYear();
  };

  var isSameMonth = function(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() && 
      date1.getMonth() === date2.getMonth();
  };

  window.Backbone.UI.Calendar = Backbone.View.extend({
    options : {
      // the selected calendar date
      date : null, 

      // the week's start day (0 = Sunday, 1 = Monday, etc.)
      weekStart : 0,

      // a callback to invoke when a new date selection is made.  The selected date
      // will be passed in as the first argument
      onSelect : null
    },

    date : null, 

    initialize : function() {
      $(this.el).addClass('calendar');
      _(this).bindAll('render');
    },

    render : function() {
      if(_(this.model).exists() && _(this.options.property).exists()) {
        this.date = _(this.model).resolveProperty(this.options.property);
        var key = 'change:' + this.options.property;
        this.model.unbind(key, this.render);
        this.model.bind(key, this.render);
      }

      else {
        this.date = this.date || this.options.date || new Date();
      }

      this._renderDate(this.date);

      return this;
    },

    _selectDate : function(date) {
      this.date = date;
      if(_(this.model).exists() && _(this.options.property).exists()) {

        // we only want to set the bound property's date portion
        var boundDate = _(this.model).resolveProperty(this.options.property);
        var updatedDate = new Date(boundDate.getTime());
        updatedDate.setMonth(date.getMonth());
        updatedDate.setDate(date.getDate());
        updatedDate.setFullYear(date.getFullYear());

        _(this.model).setProperty(this.options.property, updatedDate);
      }
      this.render();
      if(_(this.options.onSelect).isFunction()) {
        this.options.onSelect(date);
      }
      return false;
    },

    _renderDate : function(date, e) {
      if(e) e.stopPropagation();
      $(this.el).empty();

      var nextMonth = new Date(date.getFullYear(), date.getMonth() + 1);
      var lastMonth = new Date(date.getFullYear(), date.getMonth() - 1);
      var monthStartDay = (new Date(date.getFullYear(), date.getMonth(), 1).getDay());
      var inactiveBeforeDays = monthStartDay - this.options.weekStart - 1;
      var daysInThisMonth = daysInMonth(date);
      var today = new Date();
      var inCurrentMonth = isSameMonth(today, date);
      var inSelectedMonth = !!this.date && isSameMonth(this.date, date);

      var daysRow = $.el.tr({className : 'row days'}); 
      var names = dayNames.slice(this.options.weekStart).concat(
        dayNames.slice(0, this.options.weekStart));
      for(var i=0; i<names.length; i++) {
        $.el.td(names[i]).appendTo(daysRow);
      }

      var tbody, table = $.el.table(
        $.el.thead(
          $.el.th(
            $.el.a({className : 'go_back', onclick : _(this._renderDate).bind(this, lastMonth)}, '\u2039')),
          $.el.th({className : 'title', colspan : 5},
            $.el.div(formatDateHeading(date))),
          $.el.th(
            $.el.a({className : 'go_forward', onclick : _(this._renderDate).bind(this, nextMonth)}, '\u203a'))),
        tbody = $.el.tbody(daysRow));

      var day = inactiveBeforeDays >= 0 ? daysInMonth(lastMonth) - inactiveBeforeDays : 1;
      var daysRendered = 0;
      for(var rowIndex=0; rowIndex<6 ; rowIndex++) {

        var row = $.el.tr({
          className : 'row' + (rowIndex === 0 ? ' first' : rowIndex === 4 ? ' last' : '')
        });

        for(var colIndex=0; colIndex<7; colIndex++) {
          var inactive = daysRendered <= inactiveBeforeDays || 
            daysRendered > inactiveBeforeDays + daysInThisMonth;

          var callback = _(this._selectDate).bind(
            this, new Date(date.getFullYear(), date.getMonth(), day));

          var className = 'cell' + (inactive ? ' inactive' : '') + 
            (colIndex === 0 ? ' first' : colIndex === 6 ? ' last' : '') +
            (inCurrentMonth && !inactive && day === today.getDate() ? ' today' : '') +
            (inSelectedMonth && !inactive && day == this.date.getDate() ? ' selected' : '');

          $.el.td({ className : className }, 
            inactive ? 
              $.el.div({ className : 'day' }, day) : 
              $.el.a({ className : 'day', onClick : callback }, day)).appendTo(row);

          day = (rowIndex === 0 && colIndex == inactiveBeforeDays) || 
            (rowIndex > 0 && day == daysInThisMonth) ? 1 : day + 1;

          daysRendered++;
        }

        row.appendTo(tbody);
      }

      this.el.appendChild(table);

      return false;
    }
  });
}());
