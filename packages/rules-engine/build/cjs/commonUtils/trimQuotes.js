"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trimQuotes = trimQuotes;

var _isString = _interopRequireDefault(require("d2-utilizr/lib/isString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function trimQuotes(input) {
  if (input && (0, _isString.default)(input)) {
    let trimmingComplete = false;
    let beingTrimmed = input;

    while (!trimmingComplete) {
      const beforeTrimming = beingTrimmed;
      beingTrimmed = beingTrimmed.replace(/^'/, '').replace(/'$/, '');
      beingTrimmed = beingTrimmed.replace(/^"/, '').replace(/"$/, '');

      if (beforeTrimming.length === beingTrimmed.length) {
        trimmingComplete = true;
      }
    }

    return beingTrimmed;
  }

  return input;
}