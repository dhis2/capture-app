// @flow
import * as React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import defaultClasses from './table.mod.css';

type Props = {
    children: React.Node,
    className?: ?string,
};

const Cell = (props: Props, context: { table?: ?{ head: boolean, footer: boolean }}) => {
    const { children, className, ...passOnProps } = props;

    const { table } = context;
    const classes = classNames(
        defaultClasses.tableCell,
        {
            [defaultClasses.tableCellBody]: !table,
            [defaultClasses.tableCellHeader]: table && table.head,
            [defaultClasses.tableCellFooter]: table && table.footer,
        },
        className,
    );
    return (
        <td
            className={classes}
            {...passOnProps}
        >
            {props.children}
        </td>
    );
};

Cell.contextTypes = {
    table: PropTypes.object,
};


export default Cell;
