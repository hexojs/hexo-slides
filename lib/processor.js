var Q = require('q'),
  moment = require('moment'),
  _ = require('lodash'),
  pathFn = require('path'),
  util = hexo.util,
  yfm = util.yfm,
  escape = util.escape.path;

exports.slide = function(data, callback){
  var Slide = hexo.model('Slide'),
    path = data.params.path;

  // Ignore file/folder name started with `_`
  if (/\/_/.test(path)) return callback();

  // Ignore editor tmp file
  if (/[~%]$/.test(path)) return callback();

  var doc = Slide.findOne({source: data.path});

  if (data.type === 'delete'){
    if (doc){
      hexo.route.remove(doc.path);
      doc.remove();
    }

    return callback();
  }

  var statDeferred = Q.defer();
  data.stat(statDeferred.makeNodeResolver());

  var contentDeferred = Q.defer();
  data.read({cache: true}, contentDeferred.makeNodeResolver());

  Q.all([statDeferred.promise, contentDeferred.promise]).then(function(results){
    var stat = results[0],
      meta = yfm(results[1]);

    meta.content = meta._content;
    delete meta._content;

    meta.source = data.path;
    meta.raw = results[1];
    meta.slug = escape(path.substring(0, path.length - pathFn.extname(path).length));

    meta.options = _.extend({
      theme: 'default',
      controls: true,
      progress: true,
      slideNumber: false,
      history: false,
      keyboard: true,
      overview: true,
      center: true,
      touch: true,
      loop: false,
      rtl: false,
      fragments: true,
      embedded: false,
      autoSlide: 0,
      autoSlideStoppable: true,
      mouseWheel: false,
      hideAddressBar: true,
      previewLinks: false,
      transition: 'default',
      transitionSpeed: 'default',
      backgroundTransition: 'default',
      viewDistance: 3,
      parallaxBackgroundImage: '',
      parallaxBackgroundSize: ''
    }, meta.options);

    if (meta.date){
      if (!(meta.date instanceof Date)){
        meta.date = moment(meta.date, 'YYYY-MM-DD HH:mm:ss').toDate();
      }
    } else {
      meta.date = stat.ctime;
    }

    if (meta.updated){
      if (!(meta.updated instanceof Date)){
        meta.updated = moment(meta.updated, 'YYYY-MM-DD HH:mm:ss').toDate();
      }
    } else {
      meta.updated = stat.ctime;
    }

    hexo.post.render(data.source, meta, function(err, meta){
      if (err) return next(err);

      if (doc){
        doc.replace(meta, function(){
          callback();
        });
      } else {
        Slide.insert(meta, function(){
          callback();
        });
      }
    });
  }, callback);
};

exports.theme = function(data, callback){
  var Asset = hexo.model('Asset'),
    source = data.source.substring(hexo.base_dir.length),
    doc = Asset.findOne({source: source}),
    config = hexo.config,
    path = data.params.path;

  // Ignore file/folder name started with `_`
  if (/\/_/.test(path)) return callback();

  // Ignore editor tmp file
  if (/[~%]$/.test(path)) return callback();

  if (data.type === 'delete'){
    if (doc){
      hexo.route.remove(data.path);
      doc.remove();
    }

    return callback();
  }

  Asset.updateStat(source, function(err, asset){
    if (err) return callback(err);

    asset.path = config.slides.slide_dir + '/css/theme/' + path;
    asset.save();

    callback();
  });
};