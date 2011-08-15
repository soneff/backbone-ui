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
        var span = $.el.span({
          className : className,
          style : 'margin: 0 8px 0 0'
        }, name);
        el.insertBefore(span, isRight ? null : el.firstChild);
      }

      else {
        var image = new Image();
        $(image).hide();
        image.onload = function() {
          // center the image inside a 28px square
          var topOffset = Math.max(1, ((28 - image.height) / 2));
          var leftOffset = Math.max(3, ((28 - image.width) / 2));

          $(image).css({
            top : topOffset + 'px', 
            left : isRight ? 'auto' : leftOffset + 'px',
            right : isRight ? leftOffset + 'px' : 'auto'
          });
          $(image).show();
        };
        image.src = Backbone.UI.IMAGE_DIR_PATH + '/glyphs/' + name + '.png';
        image.className = className;

        el.insertBefore(image, isRight ? null : el.firstChild);
      }

      return image;
    }
  };
})();
