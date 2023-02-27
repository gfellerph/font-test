'use strict';

const If = (props, children) => {
  if (!props.condition) {
    return null;
  }
  return children;
};

exports.If = If;

//# sourceMappingURL=if.component-313f59b8.js.map