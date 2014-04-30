var path = require('path'),
  Schema = hexo.model.Schema;

var isEndWith = function(str, last){
  return str[str.length - 1] === last;
};

var Slide = module.exports = new Schema({
  title: {type: String, default: ''},
  date: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  content: {type: String, default: ''},
  description: {type: String, default: ''},
  raw: {type: String, default: ''},
  source: {type: String, required: true},
  slug: {type: String, required: true},
  options: {type: Object, default: {}}
});

Slide.virtual('path', function(){
  return hexo.config.slides.slide_dir + '/' + this.slug + '/index.html';
});

Slide.virtual('permalink', function(){
  var url = hexo.config.url;

  return url + (isEndWith(url, '/') ? '' : '/') + this.path;
});

Slide.virtual('full_source', function(){
  return path.join(hexo.source_dir, this.source);
});