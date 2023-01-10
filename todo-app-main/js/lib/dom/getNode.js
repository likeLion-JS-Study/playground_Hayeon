function getNode(node) {
  if (typeof node !== 'string')
    throw new Error('getNode함수의 인자는 문자타입이여야 합니다.');
  return document.querySelector(node);
}

function getNodes(node) {
  if (typeof node !== 'string')
    throw new Error('getNodes함수의 인자는 문자타입이여야 합니다.')
  return document.querySelectorAll(node);
}