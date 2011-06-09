// A mixin for dealing with glyphs in widgets 
(function(){
  Backbone.UI.HasGlyph = {
    GLYPH_SIZE : 22,

    insertGlyph : function(el, name) {
      return this._insertGlyph(el, name, false);
    },

    insertGlyphRight : function(el, name) {
      return this._insertGlyph(el, name, true);
    },
    
    _insertGlyph : function(el, name, isRight) {
      var hasGlyphClassName = isRight ? 'has_glyph_right' : 'has_glyph';
      if(!name || !el) {
        $(el).removeClass(hasGlyphClassName);
        return null;
      }
      $(el).addClass(hasGlyphClassName);

      var className = 'glyph ' + name + (isRight ? ' right' : '');
      if(name.length == 1) {
        var span = $.el('span', {
          className : className,
          style : 'margin: -11px 8px 0 0'
        }, name);
        el.insertBefore(span, isRight ? null : el.firstChild);
      }

      else {
        var image = new Image();
        image.onload = function() {
          $(image).css({
            marginTop : '-' + (image.height / 2) + 'px', 
            marginLeft : '-' + (image.width / 2) + 'px'
          });
        }
        image.src = Backbone.UI.IMAGE_DIR_PATH + '/glyphs/' + name + '.png';
        image.className = className;

        el.insertBefore(image, isRight ? null : el.firstChild);
      }

      return image;
    }
  };
})();
