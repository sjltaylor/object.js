	  ___  _     _           _      _     
	 / _ \| |__ (_) ___  ___| |_   (_)___ 
	| | | | '_ \| |/ _ \/ __| __|  | / __|
	| |_| | |_) | |  __/ (__| |_ _ | \__ \
	 \___/|_.__// |\___|\___|\__(_)/ |___/
	          |__/               |__/     


## Motivation

Object.js __encourages composition over inheritance__. 

Javascript doesn't have a class system.

The purpose of Object.js is **not** try to provide an approximated class system for javascript. Instead it provides functionality to support the composition of objects and prototypes in an javascript-idiosyncratic style, giving us the conveniences that a class system would provide.


## Features

* Mix modules into an object or prototype
* Override the behaviour of an existing object
* Easily specify defaults for an options argument
* Iterate over object key-value pairs
* mask an objects members
* copy objects recursively or partially
* easily wrap and delegate to another object


## Dependencies

Object.js has zero dependencies.


## Usage

		object(obj).mixin({ ... });
		object(obj).defaults({ ... });
		object(obj).overwrite({ ... });
		object(obj).override({ ... });
		object(obj).copy();
		object(obj).deepCopy();
		object(obj).each(function (value, key) { ... });
		object(obj).toArray()

### Mixin

Use this to combine the functionality of a module into your object or class:

		function MyClass () {
			object(this).mixin(MyModule);
		}

If it is a function MyModule is treated as a constructor and called like ``new MyModule`` to yield an object whose members of then assigned to ``this``. 

If you don't pass a function (constructor) the same behaviour applies except for the invocation of the constructor. So the following is equivalent to the above:

	function MyClass () {
		var myModule = new MyModule;
		object(this).mixin(myModule);
	}

#### Providing a Mixin initializer

after mixing in, if an initialize method was defined by the mixin it is called with any arguments after the mixin or mixin constructor.
	
	MyModule.prototype = {
		mixin: function () {
			console.warn(arguments);
		}
	}

	var obj = {};

	object({}).mixin(MyModule, 1, true, 'three');


A MyModule object is created and its mixin function is called with the arguments 1, true, 'three'

**Notes**: 

* The mixin initializer will not be mixed into the object.
* The functions of the mixin are mixed in before the initializer is called

### Defaults

Defaults assigns members of the specified object(s) to the object being modified without overwriting. Example usage: a function that takes options:

	function iTakeOptions (options) {
		
		options = object(options).defaults({
			async: false
		, iterations: 5
		}, {
			another: 'object'
		, 'to-mix': 'in'
		});
		...
	}

* any number of objects can be passed to defaults, they are mixed in in the order specified
* object(obj) with an undefined obj will act on a new, empty object.

	
### Overwrite

Overwriting works the same as defaults except that existing members of an object or its prototype will be replaced.
		
		var obj = { a: 123 };
		
		console.info(obj.a);
			=> 123
		
		object(obj).overwrite({ a: 456 });
		
		console.info(obj.a);
			=> 456


### Overriding

Overriding works only with functions and provides a convenient way to access the overridden function.

		var obj = {
			print: function (arg1, arg2, ...) {
				console.info(arguments);
			}
		};

		var overrides = {
			print: function (base, arg1, arg2, ...) {
				/*	 
					The overriding function will receive a base proxy as its first argument
					which provides some conveniences for invoking the overridden function.
				*/
				return base();
			}
		}

		object(obj).override(overrides);

		/*
			obj is assigned a function that creates a base proxy and passes
			it, along with any arguments, to the overriding function.
			The new function can be invoked in the same way as the original.
			In this case the override simply relays to its overridden function
		*/

		obj.print('hello', 'world');
			=> ['hello', 'world']


About the base proxy:

* ``base()``. The parameter-less invokation calls the original function with the same arguments as passed to the replacement. This is the most common scenario.

* ``base(1,2,3)``. Passing parameters calls the original function with these parameters only.

* ``base.callWithNoArguments()``. This helper can be used to call the original function without any arguments.

* ``base.inject(function(){})``. This covers the most common scenario:
		
		function (base, arg1, arg2, ...) {
			return base.inject(function (arg1, arg2, ...) {
				// this is the context of the override
				this.doSomethingElse();
			});
		}

* All of the above return the return value of the original function

* The replacement **and** original functions are called in the context of ``obj``.

This is useful in scenrios such as the following...
		
		// somewhere perhaps in a file far away...

		function MyMixin () {}

		MyMixin.prototype = {
			moduleFunction: function () { ... }
		}

		// and I define...

		function MyThing () {}

		MyThing.prototype = {
			doSomething: function () { ... }
		};


		// which uses some other functionality

		object(MyThing.prototype).mixin(MyMixin);

		// but we need to inject additional custom behaviour...

		object(MyThing.prototype).override({
			moduleFunction: function (base) {
				this.doSomething();
				return base();
			}
		});

The behaviour of MyThing is comprised of

1. Its own functions
2. A mixin called MyMixin
3. Some modifications to the MyMixin behaviour

### DelegateTo

		object(obj).delegateTo(delegate, 'this', 'that', 'theOther');

obj has functions 'this', 'that', and 'theOther', which simpled delegate to the delegate objects functions of the same name.

* arguments are forwarded
* the delegates return values are returned

### Copying

* ``object(obj).copy([memberName,]*)``
* ``object(obj).deepCopy()``

objects can be copied partially

 		obj = {
			good: 'bye'
		, hello: 'world'
		, cruel: 'world'
		};

		object(obj).copy('good', 'cruel') // any number of arguments are sliced
		=> { good: 'bye', cruel: 'world' }

### Each

Iterates through key-value pairs of an object

	  object(obj).each(function (value, key) {}) 

The specified function is called in the context of the object being iterated, in this case ``obj``.

Why ``value, key`` rather than ``key, value``: It's more common to iterate through arrays than objects, in such cases, the value is the first argument to to the callback:

		['array', 'of', 'things'].forEach(function (value) { ... })``

To prevent surprise, the object iterator stays consistent, adding the extra 'key' as a second parameter.


### ToArray

Get an array of an objects values

		var obj = {
			one: 	 1,
			two: 	 2,
			three: 3
		};

		object(obj).toArray();
		=> [1, 2, 3]


## Browser and Platform Support

Works in

* Chrome 17+
* Firefox 7+
* Safari 5.13+

Has not been tested in other browsers


## Acknowledgements

* [Figlet](http://www.figlet.org/) was used for the ASCII art
* I haven't tested it in many browsers
* I learnt a lot about javascript by reading [The Little Book on CoffeeScript](http://arcturo.github.com/library/coffeescript/)

## Contributing

1. Install node
2. Install [cup](https://github.com/sjltaylor/cup) and read the docs
3. Write some code or docs
4. Make a pull request
5. Live happily ever after
