// @flow
import * as React from 'react';
import classNames from 'classnames';

type Props = {
    children: React.Node,
    className?: ?string,
};

const getTable = () => (props: Props) => {
    const { children, className, ...passOnProps } = props;
    const classes = classNames('d2-table-default', className);
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
