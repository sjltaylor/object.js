/**/;object = (function () {

	function ObjectJsLibraryInterface (obj) {
		this._obj = obj;
	}

	ObjectJsLibraryInterface.prototype = {
		defaults: function (defaults) {
			
			for (var member in defaults) {
        if (!(member in this._obj)) {
          this._obj[member] = defaults[member];
        }
      }

			return this._obj;
		}
	, mixin: function (mixin) {
			var mixin = typeof mixin === 'function' ? new mixin : mixin;
			return this.defaults(mixin);
		}
	, overwrite: function (replacements) {
			
			for (var member in replacements) {
        this._obj[member] = replacements[member];
      }

      return this._obj;
		}
	, _overrideFunction: function (original, replacement) {
		
			var context = this._obj;

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
				
				if (!(typeof this._obj[member] === 'function')) {
					throw new Error('no function to override: ' + member);
				}
				
				this._obj[member] = this._overrideFunction(this._obj[member], overrides[member]);
			}

			return this._obj;
		}
	, copy: function () {

			var newObject = this._obj === null ? null : {};
			
			if (arguments.length) {
				for (var i = 0, l = arguments.length; i < l; i++) {
					newObject[arguments[i]] = this._obj[arguments[i]];
				}
			} else {
				this.each(function (value, key) {
					newObject[key] = value;
				});				
			}

			return newObject;
		}
	, deepCopy: function () {
			var newObject = this._obj === null ? null : {};
			
			this.each(function (value, key) {
				
				// (typeof value === 'object' && value) checks for an object that is NOT null

				newObject[key] = (typeof value === 'object' && value) ? object(value).deepCopy() : value;
			});

			return newObject;
		}
	, each: function (delegate) {
			
			for(var member in this._obj) {
				delegate.call(this._obj, this._obj[member], member);
			}
			
			return this._obj;
		}
	}

	return function object (obj) {
		
		if (!obj || typeof(obj) !== 'object') {
			throw new TypeError('argument must be an object but got: ' + obj);
		}

		return new ObjectJsLibraryInterface(obj);
	}
})();

;