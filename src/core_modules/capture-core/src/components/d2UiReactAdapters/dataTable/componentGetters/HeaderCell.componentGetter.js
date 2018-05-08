// @flow
import * as React from 'react';
import classNames from 'classnames';
import type { TableClasses } from '../../../d2Ui/dataTable/getTableComponents';

type Props = {
    children: React.Node,
    className?: ?string,
};

const getHeaderCell = (defaultClasses: TableClasses) => (props: Props) => {
    const { children, className, ...passOnProps } = props;
    const classes = classNames(defaultClasses.tableCell, defaultClasses.tableCellHeader, className);
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
