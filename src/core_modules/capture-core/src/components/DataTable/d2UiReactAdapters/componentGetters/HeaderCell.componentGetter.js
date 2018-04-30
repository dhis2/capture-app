// @flow
import * as React from 'react';
import classNames from 'classnames';

type Props = {
    children: React.Node,
    className?: ?string,
};

const getHeaderCell = () => (props: Props) => {
    const { children, className, ...passOnProps } = props;
    const classes = classNames('d2-table-cell-default', 'd2-table-cell-header-default', className);
    return (
        <td
            className={classes}
            {...passOnProps}
        >
            { props.children }
        </td>
    );
};

export default getHeaderCell;
