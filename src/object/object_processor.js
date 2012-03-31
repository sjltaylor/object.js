object.ObjectProcessor = (function () {

  function ObjectProcessor (obj) {
    this.__obj__ = obj;
  }

  ObjectProcessor.prototype = {
    defaults: function () {
      
      for (var i = 0, l = arguments.length; i < l; i++) {
        var defaults = arguments[i];

        for (var member in defaults) {
          if (!(member in this.__obj__)) {
            this.__obj__[member] = defaults[member];
          }
        }
      }

      return this.__obj__;
    }
  , __mixin__: function (options) {

      var quiet = options.quiet 
        , mixin = options.mixin
        , args  = options.args;

      var mixin = typeof mixin === 'function' ? new mixin : mixin;

      var initializer = mixin.__mixin__;
      
      for (var member in mixin) {
        if (member !== '__mixin__') {
          if (member in this.__obj__) {
            if (!quiet) {
              throw new Error('already defined: ' + member);
            }
          } else {
            this.__obj__[member] = mixin[member];
          }
        }
      }

      if (initializer) {
        initializer.apply(this.__obj__, args);
      }

      return this;

    }
  , mixin: function (mixin) {
      
      return this.__mixin__({
        mixin: mixin
      , quiet: false
      , args: Array.prototype.slice.call(arguments, 1)
      });
    }
  , qmixin: function (mixin) {
      
      return this.__mixin__({
        mixin: mixin
      , quiet: true
      , args: Array.prototype.slice.call(arguments, 1)
      });
    }
  , overwrite: function (replacements) {
      
      for (var member in replacements) {
        this.__obj__[member] = replacements[member];
      }

      return this;
    }
  , __overrideFunction__: function (original, replacement) {
    
      var context = this.__obj__;

      return function () {
        
        var callArgs = arguments;

        var baseProxy = function () {
          var baseArgs = arguments;
          return baseArgs.length ? original.apply(context, baseArgs) : original.apply(context, callArgs);
        }

        baseProxy.callWithNoArguments = function () {
          return original.call(context);
        }

        baseProxy.inject = function (injection) {
          injection.apply(context, callArgs);
          return original.call(context);
        }

        var args = Array.prototype.slice.call(callArgs, 0);
        args.unshift(baseProxy);
        return replacement.apply(context, args);
      }
    }
  , override: function (overrides) {
      
      for (var member in overrides) {
        
        if (!(typeof this.__obj__[member] === 'function')) {
          throw new Error('no function to override: ' + member);
        }
        
        this.__obj__[member] = this.__overrideFunction__(this.__obj__[member], overrides[member]);
      }

      return this;
    }
  , delegateTo: function (delegate) {

      for(var i = 1, l = arguments.length; i < l; i++) {
        var name = arguments[i];

        if (typeof delegate[name] !== 'function') {
          throw new Error('cannot delegate to non-function: ' + name)
        }

        this.__obj__[name] = (function (name) {
          return function () {
            return delegate[name].apply(delegate, arguments);
          }
        })(name);
      }

      return this.__obj__;
    }
  , copy: function () {

      var newObject = this.__obj__ === null ? null : {};
      
      if (arguments.length) {
        for (var i = 0, l = arguments.length; i < l; i++) {
          newObject[arguments[i]] = this.__obj__[arguments[i]];
        }
      } else {
        this.each(function (value, key) {
          newObject[key] = value;
        });        
      }

      return newObject;
    }
  , deepCopy: function () {
      var newObject = this.__obj__ === null ? null : {};
      
      this.each(function (value, key) {
        
        // (typeof value === 'object' && value) checks for an object that is NOT null

        newObject[key] = (typeof value === 'object' && value) ? object(value).deepCopy() : value;
      });

      return newObject;
    }
  , each: function (delegate) {
      
      for(var member in this.__obj__) {
        delegate.call(this.__obj__, this.__obj__[member], member);
      }
      
      return this.__obj__;
    }
  , toArray: function () {
      var o = this.__obj__;

      return Object.keys(o).map(function (key) {
        return o[key];
      });
    }
  }

  return ObjectProcessor;
})();