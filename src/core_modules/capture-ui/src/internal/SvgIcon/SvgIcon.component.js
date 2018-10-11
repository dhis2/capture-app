// @flow
import React from 'react';
import classNames from 'classnames';
import defaultClasses from './svgIcon.mod.css';

type Props = {
    className?: ?string,
};

const SvgIcon = (props: Props) => {
    const { className, ...passOnProps } = props;
    return (
        <svg
            className={classNames(defaultClasses.icon, props.className)}
            {...passOnProps}
        />
    );
};

export default SvgIcon;
