import hljs from "highlight.js/lib/common";

export default () => {
  document.querySelectorAll("pre code").forEach((el) => {
    hljs.highlightElement(el);
  });
}
