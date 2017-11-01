// @flow
/**
 * HACK to use react 16
 */
import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

React.PropTypes = PropTypes;
React.createClass = createReactClass;
export default React.PropTypes;
