// @flow
import * as React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

type Props = {
    children: React.Node,
    className?: ?string,
};

const Cell = (props: Props, context: { table?: ?{ head: boolean, footer: boolean }}) => {
    const { children, className, ...passOnProps } = props;

    const { table } = context;
    const classes = classNames(
        'd2-table-cell-default',
        {
            'd2-table-cell-body-default': !table,
            'd2-table-cell-header-default': table && table.head,
            'd2-table-cell-footer-default': table && table.footer,
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

const getCell = () => Cell;

export default getCell;
