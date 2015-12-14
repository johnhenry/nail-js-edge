const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();
module.exports = (opts) => new Promise((resolve, reject) => {
    const options = opts || {};
    const config = options.config;
    const destination = options.destination || 'script.js';
    const minify = options.minify;
    const bablify = options.babelify;
    const tsify = options.tsify;
    const map = options.map;
    const debug = options.debug;
    const resolvedSource = path.resolve(cwd, source);
    const resolvedDestination = path.resolve(cwd, config.dir, destination);
    var browserify = require('browserify')({debug : debug});
    if(minify){
      require('minifyify');
      browserify = browserify.plugin('minifyify', {map: map, destination : resolvedDestination + '.map'});
    }
    if(babelify){
      browserify = browserify.transform(require('babelify'), {presets: ["es2015", "react"]});
    }
    if(tsify){
      browserify = browserify.plugin('tsify');
    }

    console.log(resolvedSource)
    console.log(resolvedDestination)

    browserify.require(resolvedSource, { entry: true })
    .bundle()
    .on('error', function (error) {
      return reject(new Error(`Error creating script : ${error.message}`))})
    .pipe(fs.createWriteStream(resolvedDestination))
    .on('finish', function(){
      resolve(true);
    });
  });
