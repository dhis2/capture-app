// @flow
import classNames from 'classnames';
import * as React from 'react';
import defaultClasses from './table.module.css';

type Props = {
    children: React.Node,
    className?: ?string,
    innerRef?: ?(instance?: ?HTMLElement) => void,
};

export const HeaderCell = (props: Props) => {
    const { children, className, innerRef, ...passOnProps } = props;
    const classes = classNames(defaultClasses.tableCell, defaultClasses.tableCellHeader, className);
    return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <td
            ref={innerRef}
            className={classes}
            {...passOnProps}
        >
            { props.children }
        </td>
    );
};
