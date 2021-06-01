// @flow
/**
 * @namespace DataTable
 */

import * as React from 'react';
import classNames from 'classnames';
import defaultClasses from './table.module.css';

type Props = {
    children: React.Node,
    className?: ?string,
};

export const Table = (props: Props) => {
    const { children, className, ...passOnProps } = props;
    const classes = classNames(defaultClasses.table, className);
    return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <table
            className={classes}
            {...passOnProps}
        >
            { props.children }
        </table>
    );
};
