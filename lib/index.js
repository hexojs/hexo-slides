var _ = require('lodash');

// Default config
hexo.config = _.extend({
  slides: {
    slide_dir: 'slides'
  }
}, hexo.config);

// Model
hexo.model.register('Slide', require('./model'));

// Processor
var processor = require('./processor');

hexo.extend.processor.register('_slides/*path', processor.slide);
hexo.extend.processor.register('_slides/_themes/*path', processor.theme);

// Generator
var generator = require('./generator');

hexo.extend.generator.register(generator.static);
hexo.extend.generator.register(generator.slides);

// Tag
var tag = require('./tag');

hexo.extend.tag.register('slide', tag.slide, {ends: true, escape: false});
hexo.extend.tag.register('fragment', tag.fragment, {ends: true, escape: false});