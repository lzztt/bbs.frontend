
'use strict';

var utils        = require('./lib/utils');

function ImageBlobReduce(options) {
  if (!(this instanceof ImageBlobReduce)) return new ImageBlobReduce(options);

  options = options || {};

  this.pica = options.pica || require('pica')();
  this.initialized = false;

  this.utils = utils;
}


ImageBlobReduce.prototype.use = function (plugin /*, params, ... */) {
  var args = [ this ].concat(Array.prototype.slice.call(arguments, 1));
  plugin.apply(plugin, args);
  return this;
};


ImageBlobReduce.prototype.init = function () {
  this.use(require('./lib/jpeg_plugins').assign);
};


ImageBlobReduce.prototype.toBlob = function (blob, options) {
  var opts = utils.assign({ max: Infinity }, options);
  var env = {
    blob: blob,
    opts: opts
  };

  if (!this.initialized) {
    this.init();
    this.initialized = true;
  }

  return Promise.resolve(env)
    .then(this._blob_to_image)
    .then(this._transform)
    .then(this._cleanup)
    .then(this._create_blob)
    .then(function (_env) {
      // Safari 12 workaround
      // https://github.com/nodeca/pica/issues/199
      _env.out_canvas.width = _env.out_canvas.height = 0;

      return _env.out_blob;
    });
};


// Temporary alias until 2.x
ImageBlobReduce.prototype.to_blob = ImageBlobReduce.prototype.toBlob;


ImageBlobReduce.prototype.toCanvas = function (blob, options) {
  var opts = utils.assign({ max: Infinity }, options);
  var env = {
    blob: blob,
    opts: opts
  };

  if (!this.initialized) {
    this.init();
    this.initialized = true;
  }

  return Promise.resolve(env)
    .then(this._blob_to_image)
    .then(this._transform)
    .then(this._cleanup)
    .then(function (_env) { return _env.out_canvas; });
};


// Temporary alias until 2.x
ImageBlobReduce.prototype.to_canvas = ImageBlobReduce.prototype.toCanvas;


ImageBlobReduce.prototype.before = function (method_name, fn) {
  if (!this[method_name]) throw new Error('Method "' + method_name + '" does not exist');
  if (typeof fn !== 'function') throw new Error('Invalid argument "fn", function expected');

  var old_fn = this[method_name];
  var self = this;

  this[method_name] = function (env) {
    return fn.call(self, env).then(function (_env) {
      return old_fn.call(self, _env);
    });
  };

  return this;
};


ImageBlobReduce.prototype.after = function (method_name, fn) {
  if (!this[method_name]) throw new Error('Method "' + method_name + '" does not exist');
  if (typeof fn !== 'function') throw new Error('Invalid argument "fn", function expected');

  var old_fn = this[method_name];
  var self = this;

  this[method_name] = function (env) {
    return old_fn.call(self, env).then(function (_env) {
      return fn.call(self, _env);
    });
  };

  return this;
};


ImageBlobReduce.prototype._blob_to_image = function (env) {
  var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

  env.image = document.createElement('img');
  env.image_url = URL.createObjectURL(env.blob);
  env.image.src = env.image_url;

  return new Promise(function (resolve, reject) {
    env.image.onerror = function () { reject(new Error('ImageBlobReduce: failed to create Image() from blob')); };
    env.image.onload = function () { resolve(env); };
  });
};


ImageBlobReduce.prototype._transform = function (env) {
  //IKKI var scale_factor = env.opts.max / Math.max(env.image.width, env.image.height);
  var scale_factor = env.opts.max / (env.orientation && env.orientation > 4 ? env.image.height : env.image.width);

  if (scale_factor > 1) scale_factor = 1;

  var out_width = Math.max(Math.round(env.image.width * scale_factor), 1);
  var out_height = Math.max(Math.round(env.image.height * scale_factor), 1);

  env.out_canvas = this.pica.options.createCanvas(out_width, out_height);

  // By default use alpha for png only
  var pica_opts = { alpha: env.blob.type === 'image/png' };

  // Extract pica options if been passed
  this.utils.assign(pica_opts, this.utils.pick_pica_resize_options(env.opts));

  return this.pica
    .resize(env.image, env.out_canvas, pica_opts)
    .then(function () { return env; });
};


ImageBlobReduce.prototype._cleanup = function (env) {
  env.image.src = '';
  env.image = null;

  var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
  if (URL.revokeObjectURL) URL.revokeObjectURL(env.image_url);

  env.image_url = null;

  return Promise.resolve(env);
};


ImageBlobReduce.prototype._create_blob = function (env) {
  return this.pica.toBlob(env.out_canvas, env.blob.type)
    .then(function (blob) {
      env.out_blob = blob;
      return env;
    });
};


ImageBlobReduce.prototype._getUint8Array = function (blob) {
  if (blob.arrayBuffer) {
    return blob.arrayBuffer().then(function (buf) {
      return new Uint8Array(buf);
    });
  }

  return new Promise(function (resolve, reject) {
    var fr = new FileReader();

    fr.readAsArrayBuffer(blob);

    fr.onload = function () { resolve(new Uint8Array(fr.result)); };
    fr.onerror = function () {
      reject(new Error('ImageBlobReduce: failed to load data from input blob'));
      fr.abort();
    };
    fr.onabort = function () {
      reject(new Error('ImageBlobReduce: failed to load data from input blob (aborted)'));
    };
  });
};


module.exports = ImageBlobReduce;
module.exports.pica = require('pica');
