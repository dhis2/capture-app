// @flow
import React, { useCallback } from 'react';
import cx from 'classnames';
import classes from './iconButton.module.css';
import type { Props } from './iconButton.types';

export const IconButton = ({ children, className, dataTest, onClick, ...passOnProps }: Props) => {
    const handleKeyDown = useCallback((event: SyntheticKeyboardEvent<HTMLSpanElement>) => {
        if ([' ', 'Enter', 'Spacebar'].includes(event.key)) {
            onClick(event);
        }
    }, [onClick]);

    const handleMouseDown = useCallback((event: SyntheticMouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
    }, []);

    return (
        <span
            {...passOnProps}
            onClick={onClick}
            data-test={dataTest}
            className={cx(classes.button, className)}
            type="button"
            role="button"
            tabIndex="0"
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
        >
            {children}
        </span>
    );
};
