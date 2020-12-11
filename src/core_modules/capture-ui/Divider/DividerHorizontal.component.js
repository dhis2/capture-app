// @flow
import React from 'react';
import classNames from 'classnames';
import defaultClasses from './divider.module.css';

type Props = {
  className?: ?string,
};

const DividerHorizontal = (props: Props) => {
  const { className, ...passOnProps } = props;
  const calculatedClassNames = classNames(defaultClasses.horizontal, props.className);

  return (
    // $FlowFixMe[cannot-spread-inexact] automated comment
    <div className={calculatedClassNames} {...passOnProps} />
  );
};

export default DividerHorizontal;
