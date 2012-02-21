	  ___  _     _           _      _     
	 / _ \| |__ (_) ___  ___| |_   (_)___ 
	| | | | '_ \| |/ _ \/ __| __|  | / __|
	| |_| | |_) | |  __/ (__| |_ _ | \__ \
	 \___/|_.__// |\___|\___|\__(_)/ |___/
	          |__/               |__/     


## Motivation

This library provides tools which support the composition of objects and prototypes in an javascript-idiosyncratic style.

Object.js __prefers composition to inheritance__. It is **not** an approximated class system but provides many of the convenience such a system would provide.


## Synopsis

A utility library for object composition:

* mix modules into an object or prototype
* override the behaviour of an existing object
* easily specify defaults for an options argument
* iterate over object key-value pairs


and some other less significant things utilities.

## Usage

The main library interface is accessed by calling ``object()`` with the object to be operated on and then usually one of the library functions.

For example:

	  object(obj).overwrite({
			...
		});

Library functions available:

* mixin()
* defaults()
* overwrite()
* override()
* copy() and deepCopy()
* each() and eachWithPrototype()

### Mixin

Basic usage is as follows...

		object(obj).mixin(otherObj)

mixin also accepts a function, which is assumed to be a constructor and invoked without arguments to yield an object...
		
		object(obj).mixin(MyModule)

After this call to mixin, ``obj`` now has the members of ``otherObj`` or the object contructed with the MyModule constructor. Mixin does not overwrite existing members of ``obj`` or its prototype.


### Defaults

Defaults works the same as mixin but does not assume a function is a constructor.

	``object(obj).defaults(MyCtor)`` **is not** the same as ``object(obj).mixin(MyCtor)``

	``object(obj).defaults(otherObj)`` **is not** the same as ``object(obj).mixin(otherObj)``

This is useful for functions that takes options:

	function iTakeOptions (options) {
		
		options = object(options).defaults({
			async: false
		, iterations: 5
		}).close();

		...
	}


	
### Overwrite

Overwriting works the same as defaults except that existing members of an object or its prototype will be replaced.

		object(obj).overwrite(replacements);


### Overriding

Overriding works the same as overwriting except for overwritten member functions.
In this case the replacement function is passed a proxy to the original member function as its first argument. This happens:

		var obj = {
			print: function () {
				console.info(arguments);
			}
		};

		var overrides = {
			print: function (base, ... any other args ...) {
				// see below for how to call the original member with the base proxy
				// e.g:
				return base();
			}
		}

		object(obj).override(overrides);


Calling obj.print(1,2,3) now calls the replacement version of print which receives all of the arguments preceded by a base proxy. 

The base proxy can be used in several ways:

* base(). The parameter-less invokation calls the original function with the same arguments as passed to the replacement. This is the most common scenario.

* base(1,2,3). Passing parameters calls the original function with the these parameters only.

* base.callWithNoArguments(). base() calls the original function with the arguments passed to the replacement. This helper can be used to call the original function without any arguments.

In any case the base proxy returns the return value from the original function.

Note: the replacement **and** original functions are called in the context of obj.


### Object Copying

* object(obj).copy()
* object(obj).deepCopy() (recursively copies obj)


### Object Iteration

Iterates through key-value pairs of an object

	  object(obj).each(function (key, value) {}) 

The specified function is called in the context of the object being iterated, in this case 'obj'.

## Browser and Platform Support

Works in

* Chrome 17+
* Firefox 7+
* Safari 5.13+

Has not been tested in other browsers


## Acknowledgements

* [Figlet](http://www.figlet.org/) was used for the ASCII art
* The motivation for this project is opinionated
* I haven't tested it in many browsers

## Contributing

1. Install node
2. Install [cup](https://github.com/sjltaylor/cup) and read the docs
3. Write some code or docs
4. Make a pull request
5. Live happily ever after

