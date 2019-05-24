// @flow
import * as React from 'react';
import classNames from 'classnames';
import defaultClasses from './table.module.css';

type Props = {
    children: React.Node,
    className?: ?string,
    innerRef?: ?(instance?: ?HTMLElement) => void,
};

const HeaderCell = (props: Props) => {
    const { children, className, innerRef, ...passOnProps } = props;
    const classes = classNames(defaultClasses.tableCell, defaultClasses.tableCellHeader, className);
    return (
        <td
            ref={innerRef}
            className={classes}
            {...passOnProps}
        >
            { props.children }
        </td>
    );
};

export default HeaderCell;
