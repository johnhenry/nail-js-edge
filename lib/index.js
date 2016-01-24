const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();
module.exports = (opts) => new Promise((resolve, reject) => {
    const options = opts || {};
    const config = options.config;
    const source = options.source || 'script.js';
    const destination = options.destination || 'script.js';
    const minify = options.minify;
    const map = options.map;
    const babelify = options.babelify;
    const tsify = options.tsify;
    const debug = options.debug;
    const resolvedSource = path.resolve(cwd, source);
    const resolvedDestination = path.resolve(cwd, config.dir, destination);
    var browserify = require('browserify')({debug : debug});
    if(minify){
      require('minifyify');
      const minifyOptions = {
        __proto__:null
        ,map : map ? source + '.map.json' : false
        ,output :resolvedDestination + '.map.json'
      };
      browserify = browserify.plugin('minifyify',minifyOptions);
    }
    if(babelify){
      browserify = browserify.transform(require('babelify'), {presets: ["es2015", "react"]});
    }
    if(tsify){
      browserify = browserify.plugin('tsify');
    }
    browserify.require(resolvedSource, { entry: true })
    .bundle()
    .on('error', function (error) {
      return reject(new Error(`Error creating script : ${error.message}`))})
    .pipe(fs.createWriteStream(resolvedDestination))
    .on('finish', function(){
      resolve(true);
    });
  });
