

import React from 'react';
import classNames from 'classnames';
import defaultClasses from './shrinkLabel.module.css';

type Props = {
    children: React.ReactNode;
    shrink?: boolean;
};

export function ShrinkLabel(props: Props) {
    const {
        children,
        shrink,
    } = props;
    const className = classNames(
        defaultClasses.label,
        shrink ? defaultClasses.labelShrinked : defaultClasses.labelUnshrinked
    );
    return (
        <div className={className}>
            {children}
        </div>
    );
}
