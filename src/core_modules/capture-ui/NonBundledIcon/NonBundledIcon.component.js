// @flow
import React, { useMemo } from 'react';
import classes from './nonBundledIcon.module.css';
import type { Props } from './nonBundledIcon.types';

export const NonBundledIcon = ({
    source,
    color,
    width,
    height,
    alternativeText,
    cornerRadius: borderRadius,
}: Props) => {
    const composedStyle = useMemo(() => ({
        backgroundColor: color,
        width,
        height,
        borderRadius,
    }), [color, width, height, borderRadius]);

    return (
        <div
            style={composedStyle}
        >
            {
                source && (
                    <img
                        className={classes.image}
                        src={source}
                        alt={alternativeText}
                    />
                )
            }
        </div>
    );
};
