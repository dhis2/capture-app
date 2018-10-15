// @flow
import * as React from 'react';
import classNames from 'classnames';
import defaultClasses from './table.mod.css';

type Props = {
    children: React.Node,
    className?: ?string,
};

const HeaderCell = (props: Props) => {
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

export default HeaderCell;
