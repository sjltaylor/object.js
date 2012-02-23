	  ___  _     _           _      _     
	 / _ \| |__ (_) ___  ___| |_   (_)___ 
	| | | | '_ \| |/ _ \/ __| __|  | / __|
	| |_| | |_) | |  __/ (__| |_ _ | \__ \
	 \___/|_.__// |\___|\___|\__(_)/ |___/
	          |__/               |__/     


## Motivation

Object.js __encourages composition over inheritance__. 

Javascript doesn't have a class system.

The purpose of Object.js is **not** try to provide an approximated class system for javascript. Instead it provides functionality to support the composition of objects and prototypes in an javascript-idiosyncratic style giving us the conveniences that a class system would provide.


## Features

* Mix modules into an object or prototype
* Override the behaviour of an existing object
* Easily specify defaults for an options argument
* Iterate over object key-value pairs
* copy objects recursively


## Dependencies

Object.js has zero dependencies.


## Usage

		object(obj).mixin({ ... });
		object(obj).defaults({ ... });
		object(obj).overwrite({ ... });
		object(obj).override({ ... });
		object(obj).copy();
		object(obj).deepCopy();
		object(obj).each(function (key, value) { ... });

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


### Defaults

Defaults assigns members of the specified object to the object being modified without overwriting. Example usage: a function that takes options:

	function iTakeOptions (options) {
		
		options = object(options || {}).defaults({
			async: false
		, iterations: 5
		}).close();
		...
	}

	
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

* All of the above return the return value of the original function

* The replacement **and** original functions are called in the context of ``obj``.

This is useful in scenrios such as the following...
		
		function MyMixin () {}

		MyModule.prototype = {
			moduleFunction: function () { ... }
		}

		
		function MyThing () {}

		MyThing.prototype = {
			doSomething: function () { ... }
		};

		object(MyThing.prototype).mixin(MyMixin);

		// but we need to inject additional custom behaviour...

		object(MyThing.prototype).override({
			moduleFunction: function (base) {
				this.doSomething();
				return base();
			}
		});

The behaviour of MyThing is very clearly comprised of

1. Its own functions
2. A mixin called MyMixin
3. Some modifications to the MyMixin behaviour


### Object Copying

* ``object(obj).copy()``
* ``object(obj).deepCopy()``


### Object Iteration

Iterates through key-value pairs of an object

	  object(obj).each(function (key, value) {}) 

The specified function is called in the context of the object being iterated, in this case ``obj``.

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
