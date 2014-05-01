var Q = require('q'),
  path = require('path'),
  _ = require('lodash'),
  fs = require('fs'),
  util = hexo.util,
  file = util.file2;

var assetDir = path.join(path.dirname(__dirname), 'assets', 'reveal.js');

var getStyleAssets = Q.defer(),
  getLibAssets = Q.defer(),
  getScriptAssets = Q.defer(),
  templateDeferred = Q.defer();

file.list(path.join(assetDir, 'css'), function(err, files){
  if (err) return getStyleAssets.reject(err);

  files = files.filter(function(item){
    return path.extname(item) === '.css';
  });

  getStyleAssets.resolve(files);
});

file.list(path.join(assetDir, 'lib'), getLibAssets.makeNodeResolver());

file.list(path.join(assetDir, 'js'), getScriptAssets.makeNodeResolver());

file.readFile(path.join(__dirname, 'template.html'), templateDeferred.makeNodeResolver());

exports.static = function(locals, render, callback){
  var route = hexo.route,
    config = hexo.config;

  Q.all([getStyleAssets.promise, getLibAssets.promise, getScriptAssets.promise]).then(function(results){
    ['css', 'lib', 'js'].forEach(function(dir, i){
      results[i].forEach(function(item){
        route.set(config.slides.slide_dir + '/' + dir + '/' + item, function(fn){
          fn(null, fs.createReadStream(path.join(assetDir, dir, item)));
        });
      });
    });

    callback();
  }, callback);
};

exports.slides = function(locals, render, callback){
  var Slide = hexo.model('Slide'),
    config = hexo.config,
    route = hexo.route;

  templateDeferred.promise.then(function(template){
    Slide.each(function(item){
      route.set(item.path, function(fn){
        fn(null, _.template(template, {config: config, data: item}));
      });
    });

    callback();
  }, callback);
};