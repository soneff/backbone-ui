!function(context) {

  var formation = {

    stack : function() {

      var options = {
        padding : '10px',
        className : 'stack'
      };

      var el = document.createElement('div');

      for(var i=0; i<arguments.length; i++) {
        var arg = arguments[i];

        // if the argument is a dom node, we append it
        if(arg.nodeType === 1) {
          var isLast = i === children.length - 1;
          el.style.marginBottom = isLast ? '0' : options.padding;
          el.appendChild(arg);
        }

        // if the argument is a plain old object, and it's in the 
        // first slot, we process the object as options
        if(i === 0 && typeof(arg) === 'object') {
          processOptions(options, arg, el);
        }
      }

      el.className = options.className;
      return el;
    },

    flow : function() {
      var options = {
        padding : '10px',
        className : 'flow'
      };

      var el = document.createElement('div');
      var args = arguments;

      // process any formation options or element attributes
      var firstArg = args[0];
      if(firstArg.nodeType !== 1 && typeof(firstArg) === 'object') {
        processOptions(options, arg, el);
        args = Array.prototype.slice.call(args, 1);
      }

      // determine the spring index 
      var i, springIndex = -1;
      for(i=0; i<args.length; i++) {
        if(args[i] === 'spring') {
          springIndex = i;
          break;
        }
      }

      // add children after the spring from right to left
      var leftLimit = springIndex < 0 ? args.length : springIndex;
      var child;
      for(i=args.length-1; i>leftLimit; i--) {
        child = args[i];
        if(i === args.length - 1) el.className += ' last';
        if(i === 0) child.className += ' first';
        child.style.marginLeft = options.padding;
        child.style['float'] = 'right';

        !!previousChild && !!previousChild.nextChild ?
          el.insertBefore(child, previousChild.nextChild) :
          el.appendChild(el);

        var previousChild = child;
      }

      // add children before the spring from left to right
      for(i=0; i<leftLimit; i++) {
        child = args[i];

        // set class name
        if(i === 0) child.className += ' first';
        if(i === leftLimit - 1) child.className += 'last';

        // set style attributes
        child.style.display = 'inline-block';
        child.style.zoom = '1';
        child.style['*display'] = 'inline';
        child.style.verticalAlign = 'top';
        if(i !== leftLimit - 1) child.style.marginRight = padding;

        el.appendChild(child);
      }
      
      var br = document.createElement('br');
      br.style.clear = 'both';
      el.appendChild(br);

      el.className = options.className;
      return el;
    }
  };

  var processOptions = function(existing, given, el) {
    for(var key in given) {
      // any key corresponding to a formation option will be copied over 
      if(existing[key] !== undefined) {
        existing[key] = given[key];
      }

      // other keys will be considered element attributes
      else {
        el.setAttribute(given[key]);
      }
    }
  };

  // If we're in a CommonJS environment, we export our formation methods
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = formation;
  } 

  // otherwise, we attach them to the top level $.formation namespace
  else {
    var dollar = context['$'] || {};
    dollar['formation'] = formation;
    context['$'] = dollar;
  }

}(this);
