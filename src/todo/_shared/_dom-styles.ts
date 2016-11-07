const style = document.createElement('style');
document.head.appendChild(style);
export const styleSheet = <CSSStyleSheet>style.sheet;
styleSheet.insertRule('body {font-family: Helvetica, arial; margin: 0 auto; padding: 10px}', styleSheet.cssRules.length);
styleSheet.insertRule('section {margin: 0 auto; max-width: 600px;}', styleSheet.cssRules.length);
styleSheet.insertRule(`input[type="checkbox"] + input {
  width: 75%;
  margin: 5px;
}`, styleSheet.cssRules.length);


