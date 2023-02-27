/**
 * Generates a (sequential) unique ID. If prefix is given, the ID is appended to it.
 *
 * @param prefix The value to prefix the ID with
 * @returns Unique ID
 */
const uniqueId = (() => {
  let num = 0;
  return function (prefix) {
    prefix = prefix || '';
    num += 1;
    return prefix + num;
  };
})();
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { prefersReducedMotion as p, uniqueId as u };

//# sourceMappingURL=utils-5bf107ff.js.map