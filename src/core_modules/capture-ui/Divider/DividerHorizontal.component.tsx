import React from 'react';
import { cx } from '@emotion/css';
import defaultClasses from './divider.module.css';

type Props = {
    className?: string;
};

export const DividerHorizontal = (props: Props) => {
    const { className, ...passOnProps } = props;
    const calculatedClassNames = cx(defaultClasses.horizontal, props.className);

    return (
        <div
            className={calculatedClassNames}
            {...passOnProps}
        />
    );
};
