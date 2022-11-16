"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OptionSetHelper = void 0;

class OptionSetHelper {
  static getName(options, key) {
    if (options) {
      const option = options.find(o => o.code === key);
      return option && option.displayName || key;
    }

    return key;
  }

}

exports.OptionSetHelper = OptionSetHelper;