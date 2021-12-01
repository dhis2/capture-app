// @inheritedComponent FormLabel

import React from 'react';
import classNames from 'classnames';
import defaultClasses from './shrinkLabel.module.css';

export function ShrinkLabel(props) {
    const {
        children,
        shrink,
    } = props;
    const className = classNames(defaultClasses.label, shrink ? defaultClasses.labelShrinked : defaultClasses.labelUnshrinked);
    return (
        <div className={className}>
            {children}
        </div>
    );
}
