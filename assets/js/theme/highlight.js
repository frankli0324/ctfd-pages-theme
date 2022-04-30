import hljs from "highlight.js/lib/core";

import xml from "highlight.js/lib/languages/xml";
hljs.registerLanguage("xml", xml);

import c from "highlight.js/lib/languages/c";
hljs.registerLanguage("c", c);

import cpp from "highlight.js/lib/languages/cpp";
hljs.registerLanguage("cpp", cpp);

import csharp from "highlight.js/lib/languages/csharp";
hljs.registerLanguage("csharp", csharp);

import css from "highlight.js/lib/languages/css";
hljs.registerLanguage("css", css);

import diff from "highlight.js/lib/languages/diff";
hljs.registerLanguage("diff", diff);

import go from "highlight.js/lib/languages/go";
hljs.registerLanguage("go", go);

import java from "highlight.js/lib/languages/java";
hljs.registerLanguage("java", java);

import javascript from "highlight.js/lib/languages/javascript";
hljs.registerLanguage("javascript", javascript);

import json from "highlight.js/lib/languages/json";
hljs.registerLanguage("json", json);

import lua from "highlight.js/lib/languages/lua";
hljs.registerLanguage("lua", lua);

import perl from "highlight.js/lib/languages/perl";
hljs.registerLanguage("perl", perl);

import objectivec from "highlight.js/lib/languages/objectivec";
hljs.registerLanguage("objectivec", objectivec);

import php from "highlight.js/lib/languages/php";
hljs.registerLanguage("php", php);

import phpTemplate from "highlight.js/lib/languages/php-template";
hljs.registerLanguage("php-template", phpTemplate);

import python from "highlight.js/lib/languages/python";
hljs.registerLanguage("python", python);

import rust from "highlight.js/lib/languages/rust";
hljs.registerLanguage("rust", rust);

import scss from "highlight.js/lib/languages/scss";
hljs.registerLanguage("scss", scss);

import sql from "highlight.js/lib/languages/sql";
hljs.registerLanguage("sql", sql);

import swift from "highlight.js/lib/languages/swift";
hljs.registerLanguage("swift", swift);

import yaml from "highlight.js/lib/languages/yaml";
hljs.registerLanguage("yaml", yaml);

import typescript from "highlight.js/lib/languages/typescript";
hljs.registerLanguage("typescript", typescript);

export default () => {
  document.querySelectorAll("pre code").forEach((el) => {
    hljs.highlightElement(el);
  });
};
