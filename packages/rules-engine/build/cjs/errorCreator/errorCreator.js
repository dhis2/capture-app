"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorCreator = void 0;

const errorCreator = message => details => ({ ...details,
  message
});

exports.errorCreator = errorCreator;