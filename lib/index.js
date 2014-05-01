var _ = require('lodash');

// Default config
hexo.config = _.extend({
  slides: {
    slide_dir: 'slides',
    asset_dir: '_slides'
  }
}, hexo.config);

// Model
hexo.model.register('Slide', require('./model'));

// Processor
hexo.extend.processor.register('_slides/*path', require('./processor'));

// Generator
var generator = require('./generator');

hexo.extend.generator.register(generator.static);
hexo.extend.generator.register(generator.slides);

// Tag
var tag = require('./tag');

hexo.extend.tag.register('slide', tag.slide, {ends: true, escape: false});
hexo.extend.tag.register('fragment', tag.fragment, {ends: true, escape: false});