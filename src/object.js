var object = (function () {

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

if (typeof require === 'function' && typeof module === 'object') {
  module.exports.object                 = object;
  module.exports.object.ObjectProcessor = require('./object/object_processor').ObjectProcessor;
}
