$(function(){
  Backbone.UI.IMAGE_DIR_PATH = './images';

  window.todoList = new Backbone.Collection();

  window.TodoItemView = Backbone.View.extend({
    className : 'todo_item',

    render : function() {

      var check = $.ui('Checkbox', {
        model : this.model,
        property : 'checked',
        labelProperty : 'name'
      }).render();

      var editText = $.ui('TextField', {
        className : 'edit_text',
        model : this.model,
        property : 'name',
        onKeyPress : _.bind(function(e) {
          if(e.keyCode == Backbone.UI.KEYS.KEY_RETURN) {
            $(editText.el).hide();
          }
        }, this)
      }).render();

      var editButton = $.ui('Button', {
        className : 'edit',
        glyph : 'pencil',
        hasBorder : false,
        onClick : _.bind(function() {
          $(editText.el).show();
        }, this)
      }).render();

      var deleteButton = $.ui('Button', {
        className : 'delete',
        glyph : 'delete',
        hasBorder : false,
        onClick : _.bind(function() {
          todoList.remove(this.model);
        }, this)
      }).render();

      this.el.appendChild($.flow([
        check.el,
        'spring',
        editButton.el,
        deleteButton.el,
        editText.el
      ]));

      return this;
    }
  });

  window.AppView = Backbone.View.extend({
    className : 'app',

    render : function() {

      var input = $.ui('TextField', {
        className : 'new_item',
        placeholder : 'Add a New Item',
        onKeyPress : function(e) {
          if(e.keyCode == Backbone.UI.KEYS.KEY_RETURN) {
            todoList.add({name : input.getValue()});
            input.setValue('');
          }
        }
      }).render();

      var list = $.ui('List', {
        itemView : TodoItemView,
        model : todoList,
        labelProperty : 'name'
      }).render();
      
      this.el.appendChild(
        $.stack([
          $.el('h1', 'Todos'),
          input.el,
          list.el
        ]));

      return this;
    }
  });

  document.body.appendChild(new AppView().render().el);
});
