describe('ObjectProcessor', function () {
    
  describe('defaults()', function () {
    
    it('gains the members of the specified defaults object', function () {
      
      var cFunction = function () { return 456; }
        , dObject   = {};

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

    it('allows any number of objects which are mixed in in the order specifed', function () {
      var obj = {}
        , a   = {a:1, b:2}
        , b   = {b:3, c:3}
        , c   = {hello: 'world'};

      object(obj).defaults(a,b,c);

      expect(obj.a).toBe(1);
      expect(obj.b).toBe(2);
      expect(obj.c).toBe(3);
      expect(obj.hello).toBe('world');
    });
  });

  describe('mixin()', function () {
    
    it('gains the members of the specified mixin', function () {
      
      var cFunction = function () { return 456; };
      var obj = {};

      object(obj).mixin({
        a: function(){}
      , b: function(){}
      , c: cFunction
      , d: function(){}
      })
      
      expect(obj.c).toBe(cFunction);
    });

    it('gains the members of the specified mixins prototype', function () {
      
      var f = function () {};
      
      function MyDefaults () {}
      MyDefaults.prototype = { abc: f };

      var obj = {};

      object(obj).mixin(new MyDefaults);

      expect(obj.abc).toBe(f);
    });

    it('throws an error when there is a name collision', function () {
      var f = function () {};
      
      var obj = { a: f };

      expect(function () {
        object(obj).mixin({a:f});
      }).toThrow('already defined: a');

      expect(obj.a).toBe(f);
    });

    it('returns the object processor object', function () {
      
      var obj = {};
      var objectProcessor = object(obj);
      
      expect(objectProcessor.mixin({})).toBe(objectProcessor);
    });

    it('mixes in a constructed object if passed a function', function () {
      
      var f = function () {}
        , g = function () {};

      function MyMixin() {
        this.abc = f  
      }

      MyMixin.prototype = {
        def: g
      };

      var obj = {};

      object(obj).mixin(MyMixin);

      expect(obj.abc).toBe(f);
      expect(obj.def).toBe(g);
    });

    it('calls a mixin initializer if one exists, passing all except the first argument', function () {
      
      var obj = {};

      var mixin = {
        __mixin__: jasmine.createSpy('mixin initializer')
      };

      object(obj).mixin(mixin, 1, true, 'three');

      expect(mixin.__mixin__).toHaveBeenCalledWith(1, true, 'three');
      expect(obj.__mixin__).toBeUndefined();
    });

    it('mixes in functions before calling the initializer', function () {
      var obj = {};

      var mixin = {
        __mixin__: function () {
          this.woof();
        }
      , woof: jasmine.createSpy('mixin function')
      };

      object(obj).mixin(mixin);

      expect(obj.woof).toHaveBeenCalled();
    });

    it('throws if we try to mixin a non function', function () {
      var a = {}, b = {hello: 'string'};
      expect(function () {
        object(a).mixin(b);
      }).toThrow('cannot mixin non-function: hello');
    })

    describe('qmixin()', function () {
      
      it('does not overwrite members of the target objects prototype', function () {
       
        function MyObj () {};
        MyObj.prototype = {
          f1: function () { return 1234; }
        };

        var obj = new MyObj;

        object(obj).qmixin({
          f1: function () { return 5678; }
        });

        expect(obj.f1()).toBe(1234);
      });

      it('does not overwrite members of the target object', function () {
        
        var f = function () {};

        var obj = {a:f};

        object(obj).qmixin({a:f});

        expect(obj.a).toBe(f);
      });

      it('does not throw an error when there is a name collision', function () {
        
        var f = function () {};
        var obj = { a: f };

        expect(function () {
          object(obj).qmixin({a:f});
        }).not.toThrow();

        expect(obj.a).toBe(f);
      });

      it('returns the object processor object', function () {
      
        var obj = {};
        var objectProcessor = object(obj);
        
        expect(objectProcessor.qmixin({})).toBe(objectProcessor);
      });
    });
  });
  
  describe('overwrite()', function () {
    
    it('gains the members of the specified replacements object even if they are to be overwritten', function () {
      
      var cFunction = function () { return 456; }
        , dObject   = {};

      var obj = {
        a: 456
      , b: false
      , c: 'hello'
      };

      object(obj).overwrite({
        a: 123
      , b: true
      , c: cFunction
      , d: dObject
      });
      
      expect(obj.a).toEqual(123);
      expect(obj.b).toBe(true);
      expect(obj.c).toBe(cFunction);
      expect(obj.d).toEqual(dObject);
    });

    it('overwrites members of the target objects prototype', function () {
       
      function MyObj () {};
      MyObj.prototype = {
        f1: function () { return 1234; }
      };

      var obj = new MyObj;

      object(obj).overwrite({
        f1: function () { return 5678; }
      });

      expect(obj.f1()).toBe(5678);
    });

    it('returns the object processor object', function () {
      
      var obj = {};
      var objectProcessor = object(obj);
      
      expect(objectProcessor.overwrite({})).toBe(objectProcessor);
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

    it('returns the object processor object', function () {
      
      var obj = {};
      var objectProcessor = object(obj);
      
      expect(objectProcessor.override({})).toBe(objectProcessor);
    });

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

  describe('delegateTo()', function () {

    var obj, delegate;

    beforeEach(function () {
      
      obj = {};

      delegate = {
        hello: function () {
          return 'moto';
        }
      , world: function () {
          return false;
        }
      }

      object(obj).delegateTo(delegate, 'hello', 'world');
    });

    it('throws an error if you try and delegate to a non-function', function () {
      expect(function () {
        object({}).delegateTo({fish: true}, 'fish');
      }).toThrow("cannot delegate to non-function: fish");
    });

    it('calls the specified functions on the delegate', function () {
      
      spyOn(delegate, 'hello');

      obj.hello();

      expect(delegate.hello).toHaveBeenCalled();
    });

    it('returns the delegates return value', function () {
      
      expect(obj.hello()).toEqual('moto');
    });

    it('passes all arguments to the delegate function', function () {
      
      spyOn(delegate, 'world');
      obj.world(1,2,3,4);
      expect(delegate.world).toHaveBeenCalledWith(1,2,3,4);
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
      obj.b   = 456;

      var pairs = [];

      object(obj).each(function (value, key) {
        pairs.push([value, key]);
      });

      expect(pairs).toEqual([[456, 'b'], [123, 'a']]);
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

  describe('toArray()', function () {
    it('returns an array of all of the objects members', function () {
      
      var obj = {
        one:   1,
        two:   2,
        three: 3
      };

      expect(object(obj).toArray()).toEqual([1,2,3]);
    });
  });
});