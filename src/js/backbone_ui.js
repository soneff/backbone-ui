(function() {
  // ensure backbone and jquery are available
  typeof Backbone !== 'undefined' || alert('backbone environment not loaded') ;
  typeof $ !== 'undefined' || alert('jquery environment not loaded');

  // define our Backbone.UI namespace
  Backbone.UI = Backbone.UI || {
    KEYS : {
      KEY_BACKSPACE: 8,
      KEY_TAB:       9,
      KEY_RETURN:   13,
      KEY_ESC:      27,
      KEY_LEFT:     37,
      KEY_UP:       38,
      KEY_RIGHT:    39,
      KEY_DOWN:     40,
      KEY_DELETE:   46,
      KEY_HOME:     36,
      KEY_END:      35,
      KEY_PAGEUP:   33,
      KEY_PAGEDOWN: 34,
      KEY_INSERT:   45
    },

    IMAGE_DIR_PATH : '/images'
  };

  _(Backbone.View.prototype).extend({
    // resolves the appropriate content from the given choices
    resolveContent : function(content, model, property) {
      return _(property).exists() && _(model).exists() ? 
        _(model).resolveProperty(property) :
        _(content).exists() && _(content).isFunction() ? 
        content(model) : 
        content;
    }
  });

  // Add some utility methods to underscore
  _.mixin({
    // produces a natural language description of the given
    // index in the given list
    nameForIndex : function(list, index) {
      return list.length === 1 ? 'first last' : 
        index === 0 ? 'first' : 
        index === list.length - 1 ? 
        'last' : 'middle';
    },

    exists : function(object) {
      return !_(object).isNull() && !_(object).isUndefined();
    },
    
    // resolves the value of the given property on the given 
    // object.
    resolveProperty : function(object, property) {
      var result = null;
      if(_(property).exists() && _(property).isString()) {
        var parts = property.split('.');
        _(parts).each(function(part) {
          if(_(object).exists()) {
            var target = result || object;
            result = _(target.get).isFunction() ? target.get(part) : target[part];
          }
        });
      }

      return result;
    },

    // sets the given value for the given property on the given 
    // object.
    setProperty : function(object, property, value) {
      if(!property) return;

      var parts = property.split('.');
      _(parts.slice(0, parts.length - 2)).each(function(part) {
        if(!_(object).isNull() && !_(object).isUndefined()){ 
          object = _(object.get).isFunction() ? object.get(part) : object[part];
        }
      });

      if(!!object) {
        if(_(object.set).isFunction()) {
          var attributes = {};
          attributes[property] = value;
          object.set(attributes);
        }
        else {
          object[property] = value;
        }
      }
    }
  });

  // Add some utility methods to JQuery
  _($.fn).extend({
    // aligns each element releative to the given anchor
    alignTo : function(anchor, pos, xFudge, yFudge, container) {
      _.each(this, function(el) {
        // in order for alignTo to work properly the element needs to be visible
        // if it's hidden show it off screen so it can be positioned
        if(el.style.display == 'none') {
          var rehide=true;
          $(el).css({position:'absolute',top:'-10000px', left:'-10000px', display:'block'});
        }

        var o = _alignCoords(el, anchor, pos, xFudge, yFudge);
        $(el).css({
          position:'absolute',
          left: Math.round(o.x) + 'px',
          top: Math.round(o.y) + 'px'
        });

        if(rehide) $(el).hide();
      });
    },

    safeAttr : function(attributes) {
      if(_(attributes).exists()) {
        _(this).each(function(el) {
          if(attributes.className) {
            $(el).addClass(attributes.className);
            delete(attributes.className);
          }
          $(el).attr(attributes);
        });
      }
    },

    // Hides each element the next time the user clicks the mouse or presses a
    // key.  This is a one-shot action - once the element is hidden, all
    // related event handlers are removed.
    autohide : function(options) {
      _.each(this, function(el) {
        options = _.extend({
          leaveOpen : false,
          hideCallback : false,
          ignoreInputs: false,
          ignoreKeys : [],
          leaveOpenTargets : []
        }, options || {});
        
        el._autoignore = true;
        setTimeout(function() {
          el._autoignore = false; $(el).removeAttr('_autoignore'); 
        }, 0);

        if (!el._autohider) {
          el._autohider = _.bind(function(e) {
            var target = e.target;
            if (options.ignoreInputs && (/input|textarea|select|option/i).test(target.nodeName)) return;
            //if (el._autoignore || (options.leaveOpen && Element.partOf(e.target, el)))
            if(el._autoignore) return;
            // pass in a list of keys to ignore as autohide triggers
            if(e.type && e.type.match(/keypress/) && _.include(options.ignoreKeys, e.keyCode)) return;
            
            // allows you to provide an array of elements that should not trigger autohiding.
            // This is useful for doing thigns like a flyout menu from a pulldown
            //if(options.leaveOpenTargets && options.leaveOpenTargets.detect(function(t) {
              //return Element.partOf(e.element(), $(t));
            //})) {
              //return;
            //}
            
            var proceed = (options.hideCallback) ? options.hideCallback(el) : true;
            if (!proceed) return;

            $(el).hide();
            $(document).bind('click', el._autohider);
            $(document).bind('keypress', el._autohider);
            el._autohider = null;
          }, this);

          $(document).bind('click', el._autohider);
          $(document).bind('keypress', el._autohider);
        }
      });
    }
  });

  // Add some utility methods to Backbone.UI
  _($).extend({
    ui : function() {
      var constructor = Backbone.UI[arguments[0]];
      var parts = _split.apply(this, _(arguments).toArray().slice(1));
      if(!!constructor && _(constructor).isFunction()) {
        widget = new constructor(parts.attributes || {}).render();
        _(parts.children).each(function(child) {
          widget.el.appendChild(child);
        });
      }

      return widget;
    }, 

    // Generates a new DOM node with optional 
    // attributes and child elements
    el : function() {
      // create the element and split the arguments into 
      // attributes and children
      var tagName = arguments.length === 0 ? 'div' : arguments[0];
      var el = document.createElement(tagName);
      var parts = _split.apply(this, _(arguments).toArray().slice(1));

      // apply attributes
      $(el).safeAttr(parts.attributes);
      
      // insert children
      _(parts.children).each(function(child) {
        el.appendChild(child);
      });

      return el;
    },

    stack : function() {
      var padding = '10px';
      var stackEl = $.el('span', {className : 'stack'});
      var parts = _split.apply(this, _(arguments).toArray());
      if(!!parts.attributes.padding) {
        padding = parts.attributes.padding;
        delete(parts.attributes.padding);
      }
      $(stackEl).safeAttr(parts.attributes);
      var children = parts.children;

      var i = 0;
      _(children).each(function(arg, i) {
        var isLast = i == children.length - 1;

        var el = arg.el ? arg.el : arg; 
        if(!!el.nodeType) {
          $(el).css({marginBottom : isLast ? '0' : padding});
          stackEl.appendChild(el);
          stackEl.appendChild($.el('span', {style : 'clear:both;'}));
        }
      });

      return stackEl;
    },

    flow : function() {
      var padding = '10px';
      var flowEl = $.el('div', {className : 'flow'});
      var parts = _split.apply(this, _(arguments).toArray());
      if(!!parts.attributes.padding) {
        padding = parts.attributes.padding;
        delete(parts.attributes.padding);
      }
      $(flowEl).safeAttr(parts.attributes);
      var children = parts.children;

      // determine the spring index 
      var springIndex = -1;
      var i;
      for(i=0; i<children.length; i++) {
        var child = children[i];
        if(!_(child).isElement() && child.textContent == 'spring') {
          springIndex = i;
          break;
        }
      }

      // add children after the spring from right to left
      var leftLimit = springIndex < 0 ? children.length : springIndex;
      for(i=children.length-1; i>leftLimit; i--) {
        var el = children[i];
        $(el).css({
          'float' : 'right', 
          marginLeft : padding
        });
        if(i === 0) $(el).addClass('last');

        !!previousEl && !!previousEl.nextChild ?
          flowEl.insertBefore(el, previousEl.nextChild) :
          flowEl.appendChild(el);

        var previousEl = el;
      }

      // add children before the spring from left to right
      for(i=0; i<leftLimit; i++) {
        // render/rerender the children as requested
        var elementLeft = children[i].el ? children[i].el : children[i];
        $(elementLeft).css({
          'float' : 'left', 
          marginRight : (i !== leftLimit - 1) ? padding : null
        });
        if(i === 0) $(elementLeft).addClass('first');
        if((i === leftLimit - 1) && (springIndex === -1)) $(elementLeft).addClass('last');
        flowEl.appendChild(elementLeft);
      }
      
      flowEl.appendChild($.el('br', {style: 'clear:both;height:0px;line-height:0px'}));

      return flowEl;
    }
  });

  var _split = function() {
    var attributes = {}, children = [];
    if(arguments.length > 0) {
      // check if the first argument represents child nodes
      children = _findChildren(arguments[0]);

      // if not, we assume it's an attribute arguemnt, and we look
      // for a second argument that may contain child nodes
      if(!children) {
        attributes = arguments[0];
        if(arguments.length > 1) { 
          children = _findChildren(arguments[1]);
        }
      }
    }
    return {attributes : attributes, children : children};
  };

  var _findChildren = function(arg) {
    var children;

    if(!!arg){
      // if the argument is a dom node, we simply add
      // it to our collection
      if(_(arg).isElement()) {
        children = [arg];
      }

      // if the argument is an array, we walk through it
      else if(_(arg).isArray()) {
        children = [];
        for(var i=0; i<arg.length; i++) {
          children.push(_(arg[i]).isElement() ? 
            arg[i] : document.createTextNode(arg[i]));
        }
      }

      // if the argument is a string or a number, we create a text node
      else if(_(arg).isString() || _(arg).isNumber()) {
        children = [document.createTextNode(arg)];
      }
    }
    
    return children;
  };

  var _alignCoords = function(el, anchor, pos, xFudge, yFudge) {
    el = $(el);
    anchor = $(anchor);
    pos = pos || '';

    // Get anchor bounds (document relative)
    var bOffset = anchor.offset();
    var bDim = {width : anchor.width(), height : anchor.height()};

    // Get element dimensions
    var elbOffset = el.offset();
    var elbDim = {width : el.width(), height : el.height()};

    // Determine align coords (document-relative)
    var x,y;
    if (pos.indexOf('-left') >= 0) {
      x = bOffset.left;
    } else if (pos.indexOf('left') >= 0) {
      x = bOffset.left - elbDim.width;
    } else if (pos.indexOf('-right') >= 0) {
      x = (bOffset.left + b.width) - elbDim.width;
    } else if (pos.indexOf('right') >= 0) {
      x = bOffset.left + bDim.width;
    } else { // Default = centered
      x = bOffset.left + (bDim.width - elbDim.width)/2;
    }

    if (pos.indexOf('-top') >= 0) {
      y = bOffset.top;
    } else if (pos.indexOf('top') >= 0) {
      y = bOffset.top - elbDim.height;
    } else if (pos.indexOf('-bottom') >= 0) {
      y = (bOffset.top + bDim.height) - elbDim.height;
    } else if (pos.indexOf('bottom') >= 0) {
      y = bOffset.top + bDim.height;
    } else { // Default = centered
      y = bOffset.top + (bDim.height - elbDim.height)/2;
    }
    
    // Check for constrainment (default true)
    var constraint = true;
    if (pos.indexOf('no-constraint') >= 0) constraint = false;

    // Add fudge factors
    x += xFudge || 0;
    y += yFudge || 0;

    // Create bounds rect/constrain to viewport
    //var nb = new zen.util.Rect(x,y,elb.width,elb.height);
    //if (constraint) nb = nb.constrainTo(zen.util.Dom.getViewport());

    // Convert to offsetParent coordinates
    //if(el.offsetParent()) {
      //var ob = $(el.offsetParent).getOffset();
      //nb.translate(-ob.left, -ob.top);
    //}

    // Return rect, constrained to viewport
    return {x : x, y : y};
  };

})();
