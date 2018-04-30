// @flow
import * as React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

type Props = {
    children: React.Node,
    className?: ?string,
};

const Row = (props: Props, context: { table?: ?{ head: boolean, footer: boolean }}) => {
    const { children, className, ...passOnProps } = props;

    const { table } = context;
    const classes = classNames(
        'd2-table-row-default',
        {
            'd2-table-row-body-default': !table,
            'd2-table-row-header-default': table && table.head,
            'd2-table-row-footer-default': table && table.footer,
        },
        className,
    );

    return (
        <tr
            className={classes}
            {...passOnProps}
        >
            {props.children}
        </tr>
    );
};

Row.contextTypes = {
    table: PropTypes.object,
};

const getRow = () => Row;

export default getRow;
