object = (function () {

  function object (obj) {
    
    if (typeof obj === 'undefined') {
      obj = {};
    }

    return new object.ObjectProcessor(obj);
  }

  object.plugin = function (plugins) {
  	object(object.ObjectProcessor.prototype).mixin(plugins);
  }

  return object;
})();

