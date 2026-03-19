import React from 'react';
import { cx } from '@emotion/css';
import defaultClasses from './svgIcon.module.css';

type Props = {
    className?: string | null;
    children?: React.ReactNode;
    [key: string]: any;
};

export const SvgIcon = (props: Props) => {
    const { className, ...passOnProps } = props;
    return (
        <svg
            className={cx(defaultClasses.icon, props.className)}
            {...passOnProps}
        />
    );
};
