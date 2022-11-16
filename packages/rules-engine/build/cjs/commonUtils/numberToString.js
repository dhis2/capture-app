"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberToString = void 0;

const numberToString = number => isNaN(number) || number === Infinity ? '' : String(number);

exports.numberToString = numberToString;