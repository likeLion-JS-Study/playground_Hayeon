export const memo = (() => {
  const cache = {};
  return (key, callback) => {
    if (!callback) return cache[key];
    if (cache[key]) return ;
    cache[key] = callback();
  }
})();