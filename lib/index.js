var generator = require('./generator');

hexo.extend.generator.register(generator.static);
hexo.extend.generator.register(generator.slides);