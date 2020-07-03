// @flow
import React from 'react';
import classNames from 'classnames';
import defaultClasses from './svgIcon.module.css';

type Props = {
    className?: ?string,
};

const SvgIcon = (props: Props) => {
    const { className, ...passOnProps } = props;
    return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <svg
            className={classNames(defaultClasses.icon, props.className)}
            {...passOnProps}
        />
    );
};

export default SvgIcon;
