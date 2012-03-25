describe('object()', function () {
  
  it('returns an object.ObjectProcessor', function () {
    expect(object({})).toBeInstanceOf(object.ObjectProcessor);
  });

  it('returns a new object if an undefined object is passed', function () {
    var undef;
    expect(object(undef).mixin({a:1})).toEqual({a:1});
  });

  describe('object.plugin()', function () {

    it('throws an error if a name collision occurs', function () {
      expect(function () {
        object.plugin({
          each: function () {}
        });
      }).toThrow('already defined: each');
    });

    it('makes plugin functions available on the object processor', function () {
      
      var obj = {};

      object.plugin({
        meow: function () {
          return 'meow?';
        }
      });

      expect(object(obj).meow()).toBe('meow?');
    });

    it('allows plugins to use existing object.ObjectProcessor functions', function () {
      
      var obj = {a: 1, b: 2, c: 3};

      object.plugin({
        array: function () {
          return this.toArray();
        }
      });

      expect(object(obj).array()).toEqual([1,2,3]);
    });
  })
});