var Q = require('q'),
  path = require('path'),
  _ = require('lodash'),
  fs = require('fs'),
  util = hexo.util,
  file = util.file2;

var assetDir = path.join(path.dirname(__dirname), 'assets', 'reveal.js');

var getStyleAssets = Q.defer(),
  getScriptAssets = Q.defer();

file.list(path.join(assetDir, 'css'), function(err, files){
  if (err) return getStyleAssets.reject(err);

  files = files.filter(function(item){
    return path.extname(item) === '.css';
  });

  getStyleAssets.resolve(files);
});

file.list(path.join(assetDir, 'js'), function(err, files){
  if (err) return getScriptAssets.reject(err);

  getScriptAssets.resolve(files);
});

exports.static = function(locals, render, callback){
  var route = hexo.route;

  Q.all([getStyleAssets.promise, getScriptAssets.promise]).then(function(results){
    ['css', 'js'].forEach(function(dir, i){
      results[i].forEach(function(item){
        route.set('_slides/' + dir + '/' + item, function(fn){
          fn(null, fs.createReadStream(path.join(assetDir, dir, item)));
        });
      });
    });

    callback();
  }, callback);
};

exports.slides = function(locals, render, callback){
  callback();
};