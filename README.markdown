      ___  _     _           _      _     
     / _ \| |__ (_) ___  ___| |_   (_)___ 
    | | | | '_ \| |/ _ \/ __| __|  | / __|
    | |_| | |_) | |  __/ (__| |_ _ | \__ \
     \___/|_.__// |\___|\___|\__(_)/ |___/
              |__/               |__/     


## Motivation

This library provides functionality to support the composition of objects in a javascript-idiosyncratic style, giving us the conveniences that a class system provides while **not trying to approximate a class system**.

Object.js __encourages composition over inheritance__.

## Features

* Mixins
* Override functions of an existing object
* Easily specify defaults for an options argument
* Iterate over object key-value pairs
* Slice an objects members
* Copy objects
* Wrap and delegate to another object
* Extensible: `object(obj).yourFunctionHere()`


## Dependencies

Object.js has zero dependencies.


## Usage

    object(obj).mixin({ ... });
    object(obj).qmixin({ ... });
    object(obj).defaults({ ... });
    object(obj).overwrite({ ... });
    object(obj).override({ ... });
    object(obj).copy();
    object(obj).deepCopy();
    object(obj).each(function (value, key) { ... });
    object(obj).delegateTo(otherObj, 'this', 'that', 'theOther');
    object(obj).toArray()
    // use plugins to have ...
    object(obj).yourFunctionHere();


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
