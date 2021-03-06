// https://github.com/sebmarkbage/ecmascript-rest-spread

import * as t from "../../../types";

export var metadata = {
  stage: 2,
  dependencies: ["es6.destructuring"]
};

/**
 * [Please add a description.]
 */

var hasSpread = function (node) {
  for (var i = 0; i < node.properties.length; i++) {
    if (t.isSpreadProperty(node.properties[i])) {
      return true;
    }
  }
  return false;
};

/**
 * [Please add a description.]
 */

export var visitor = {

  /**
   * [Please add a description.]
   */

  ObjectExpression(node, parent, scope, file) {
    if (!hasSpread(node)) return;

    var args = [];
    var props = [];

    var push = function () {
      if (!props.length) return;
      args.push(t.objectExpression(props));
      props = [];
    };

    for (var i = 0; i < node.properties.length; i++) {
      var prop = node.properties[i];
      if (t.isSpreadProperty(prop)) {
        push();
        args.push(prop.argument);
      } else {
        props.push(prop);
      }
    }

    push();

    if (!t.isObjectExpression(args[0])) {
      args.unshift(t.objectExpression([]));
    }

    return t.callExpression(file.addHelper("extends"), args);
  }
};
