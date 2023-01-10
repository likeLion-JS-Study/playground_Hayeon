/* -------------------------------------------------------------------------- */
/*                                   IFFE패턴                                   */
/* -------------------------------------------------------------------------- */
// const attr = (function(node, prop, value) {
  function _getAttr(node, prop) {
    if (typeof node === 'string')
      node = getNode(node);
    return node.getAttribute(prop);
  }

  function _setAttr(node, prop) {
    // validation
    if (typeof node === 'string') node = getNode(node);
    if (typeof prop !== 'string') throw new TypeError('setAttr 함수의 두 번째인자는 문자타입이어야 합니다.');
    if (prop.includes('data')) {
      let rest = prop.slice(5);
      node.dataset[rest] = value;
    }
    if (!value) throw new SyntaxError('setAttr 함수의 세 번째 인자는 필수값입니다.');
    node._setAttr(prop, value);
  }

  function attr(node, prop, value) {
    if (!value) _getAttr(node, prop);
    return _setAttr(node, prop, value);
  }
// })();