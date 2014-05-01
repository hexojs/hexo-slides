exports.slide = function(args, content){
  return [
    '<escape><section></escape>',
    content,
    '<escape></section></escape>'
  ].join('');
};

exports.fragment = function(args, content){
  return [
    '<escape><div class="fragment"></escape>',
    content,
    '<escape></div></escape>'
  ].join('');
};