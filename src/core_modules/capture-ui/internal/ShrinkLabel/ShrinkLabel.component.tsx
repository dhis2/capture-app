

import React from 'react';
import { cx } from '@emotion/css';
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
    const className = cx(defaultClasses.label, shrink ? defaultClasses.labelShrinked : defaultClasses.labelUnshrinked);
    return (
        <div className={className}>
            {children}
        </div>
    );
}
