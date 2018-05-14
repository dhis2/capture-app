// @flow
/**
 * @namespace DataTable
 */

import * as React from 'react';
import classNames from 'classnames';
import type { TableClasses } from '../../../d2Ui/dataTable/getTableComponents';

type Props = {
    children: React.Node,
    className?: ?string,
};

const getTable = (defaultClasses: TableClasses) => (props: Props) => {
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

export default getTable;
