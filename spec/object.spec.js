describe('object()', function () {
	
	it('returns the Object.js library interface', function () {
		
		var api = object({});
		
		expect(api).toBeDefined();
		expect(api.defaults).toBeAFunction();
		expect(api.mixin).toBeAFunction();
		expect(api.overwrite).toBeAFunction();
		expect(api.override).toBeAFunction();
		expect(api.copy).toBeAFunction();
		expect(api.deepCopy).toBeAFunction();
		expect(api.each).toBeAFunction();
	});

	it('raises a helpful error if the argument is not an object', function () {
		expect(function () {
			object(function(){});
		}).toThrow();
	});

	it('raises a helpful error if an undefined object is passed', function () {
		expect(function () {
			object({}.undefinedMember);
		}).toThrow();
	});

	it('raises a helpful error if a null object is passed', function () {
		expect(function () {
			object(null);
		}).toThrow();
	})

	describe('library api', function () {
		
		describe('defaults()', function () {
			
			it('gains the members of the specified defaults object', function () {
		    
		    var cFunction = function () { return 456; }
		    	, dObject		= {};

		    var obj = object({}).defaults({
		    	a: 123
		    , b: true
		    , c: cFunction
		    , d: dObject
		    })
		    
		    expect(obj.a).toEqual(123);
		    expect(obj.b).toBe(true);
		    expect(obj.c).toBe(cFunction);
		    expect(obj.d).toEqual(dObject);
		  });

		  it('gains the members of the specified defaults objects prototype', function () {
		  	
		  	function MyDefaults () {}
		  	MyDefaults.prototype = { abc: 123 };

		  	var obj = object({}).defaults(new MyDefaults);

		  	expect(obj.abc).toBe(123);
		  });

		  it('does not overwrite members of the target object', function () {
		    
		    var obj = object({a:123}).defaults({a:456});

		    expect(obj.a).toBe(123);
		  });

		  it('does not overwrite members of the target objects prototype', function () {
		  	 
		  	function MyObj () {};
		  	MyObj.prototype = {
		  	 	f1: function () { return 1234; }
		  	};

		  	var obj = object(new MyObj).defaults({
		  		f1: function () { return 5678; }
		  	});

		  	expect(obj.f1()).toBe(1234);
		  });

		  it('returns the target object', function () {
		    var obj = {};
		    var result = object(obj).defaults(obj);
		    expect(result).toBe(obj);
		  });
		});

		describe('mixin()', function () {
			
			/*
				
				The full behaviour of mixin() is not specced because it does little more than delegate to defaults();

			*/

			it('mixes in a constructed object if passed a function', function () {
				
				function MyMixin() {
					this.abc = 123	
				}

				MyMixin.prototype = {
					def: 456
				};

				var obj = object({}).mixin(MyMixin);

				expect(obj.abc).toBe(123);
				expect(obj.def).toBe(456);
			});
		});
		
		describe('overwrite()', function () {
			
			it('gains the members of the specified replacements object even if they are to be overwritten', function () {
		    
		    var cFunction = function () { return 456; }
		    	, dObject		= {};

		    var obj = object({
			    a: 456
			  , b: false
			  , c: 'hello'
			  }).overwrite({
		    	a: 123
		    , b: true
		    , c: cFunction
		    , d: dObject
		    })
		    
		    expect(obj.a).toEqual(123);
		    expect(obj.b).toBe(true);
		    expect(obj.c).toBe(cFunction);
		    expect(obj.d).toEqual(dObject);
		  });

		  it('does overwrite members of the target objects prototype', function () {
		  	 
		  	function MyObj () {};
		  	MyObj.prototype = {
		  	 	f1: function () { return 1234; }
		  	};

		  	var obj = object(new MyObj).overwrite({
		  		f1: function () { return 5678; }
		  	});

		  	expect(obj.f1()).toBe(5678);
		  });

		  it('returns the target object', function () {
		    var obj = {};
		    var result = object(obj).overwrite(obj);
		    expect(result).toBe(obj);
		  });
		});

		describe('override()', function () {
		  
		  it("throws an error if there is no function to override", function() {
		    expect(function () {
		      object({f:123}).override({
		        f : function () {}
		      });
		    }).toThrow('no function to override: f');
		  });

		  it('returns the obj', function () {
		  	var obj = {};
		  	expect(object(obj).override({})).toBe(obj);
		  })

		  describe("base proxy usage", function() {
		    
		    var obj, args, context;

		    beforeEach(function () {
		    	obj = {
		        func: function () { 
		          args = arguments;
		          context = this;
		          return 'original return value'
		        }
		       , originalMember2: 'hello world'
		      }
		    });

		    it("calls the original function with the passed arguments when called with no arguments", function () {

		      var overrideArgs;

		      object(obj).override({
		        func: function (base) {
		          base();
		          overrideArgs = arguments;
		        }
		      })

		      obj.func(1,2,3)

		      expect(args).toEqual([1,2,3]);
		      expect(overrideArgs.length).toEqual(4);
		      expect(overrideArgs[0]).toBeAFunction();
		    });

		    it("calls the original function with specified arguments", function () {

		      object(obj).override({
		        func: function (base) {
		          base(4,5,6);
		        }
		      })

		      obj.func(1,2,3)

		      expect(args).toEqual([4,5,6]);
		    });

		    it("calls the original function with no arguments if .callWithNoArguments() is used", function () {

		      object(obj).override({
		        func: function (base) {
		          base.callWithNoArguments();
		        }
		      })

		      obj.func(1,2,3)

		      expect(args).toEqual([]);
		    });

		    it('returns the return value of the original function', function () {
		    	
		    	object(obj).override({
		        func: function (base) {
		          return base();
		        }
		      });

		      expect(obj.func()).toBe('original return value');
		    });

		    it("receive any original parameters after base proxy", function () {
		       	
		       	var overrideArgs, _base;

		        object(obj).override({
			        func: function (base) {
			          base();
			          _base = base;
			          overrideArgs = Array.prototype.slice.call(arguments, 1);
			        }
			      });

		        obj.func('hello there', 123);

		        expect(_base).toBeAFunction();
		        expect(overrideArgs).toEqual(['hello there', 123]);
		    });

		    it("causes the override and original to be called in the context of the overridden object", function () {
		      
		      var overrideContext, originalContext;

		      var target = {
		        func: function () { 
		          originalContext = this;
		        }
		      };

		      var overrideContext;

		      object(target).override({
		        func: function (base) {
		        	base();
		          overrideContext = this;
		        }
		      })

		      target.func();

		      expect(overrideContext).toBe(target);
		      expect(originalContext).toBe(target);
		    });

		    it('injects functionality with base.inject()', function () {
		    	
		    	var original = jasmine.createSpy('original').andReturn('HELLO');
		    	
		    	var obj = {
		    		hello: original
		    	};

		    	var context, args;
					
					object(obj).override({
		    		hello: function (base) {
		    			return base.inject(function () {
		    				context = this;
		    				args = arguments;
		    			})
		    		}
		    	})

					var rtn = obj.hello(1,2,3);

					expect(rtn).toBe('HELLO');
					expect(args).toEqual([1,2,3]);
					expect(context).toBe(obj);
		    });
		  });
		});

		describe('copy()', function () {
			it('copies members, does not recur', function () {
				
				var obj = {
					a: 123,
					b: null,
					c: { d: 'hello' }
				};

				var copy = object(obj).copy();

				expect(copy.a).toBe(123);
				expect(copy.b).toBe(null);
				expect(copy.c).toBe(obj.c);
			});

			it('returns a new object containing only the members specified', function () {
				var obj = {
					good: 'bye'
				, hello: 'world'
				, cruel: 'world'
				};

				var slice = object(obj).copy('good', 'cruel');
				
				expect(slice).toEqual({ good: 'bye', cruel: 'world' });
			})
		});

		describe('deepCopy()', function () {
			it('copies members recursively', function () {
				
				var obj = {
					a: 123,
					b: null,
					c: { d: 'hello' }
				};

				var copy = object(obj).deepCopy();

				expect(copy.a).toBe(123);
				expect(copy.b).toBe(null);
				expect(copy.c).not.toBe(obj.d);
				expect(copy.c.d).toBe('hello');
			});
		});

		describe('each()', function () {
			
			it ('passes key value pairs to the delegate', function () {
				
				function MyObj () {}

				MyObj.prototype = { a: 123 };

				var obj = new MyObj;
				obj.b 	= 456;

				var pairs = [];

				object(obj).each(function (key, value) {
					pairs.push([key, value]);
				});

				expect(pairs).toEqual([['b', 456], ['a', 123]]);
			});

			it('calls the delegate in the context of the object being iterated', function () {
				var obj = {a: 123}
				var context;

				object(obj).each(function () {
					context = this;
				});

				expect(context).toBe(obj);
			});

			it('returns the object being iterated', function () {
				var obj = {};

				var rtn = object(obj).each(function () {});

				expect(rtn).toBe(obj);
			});
		});
	});
});