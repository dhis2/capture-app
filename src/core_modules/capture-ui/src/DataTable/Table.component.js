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

const Table = (props: Props) => {
    const { children, className, ...passOnProps } = props;
    const classes = classNames(defaultClasses.table, className);
    return (
        <table
            className={classes}
            {...passOnProps}
        >
            { props.children }
        </table>
    );
};

export default Table;
