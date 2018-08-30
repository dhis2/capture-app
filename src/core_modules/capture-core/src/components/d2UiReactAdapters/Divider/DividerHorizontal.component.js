// @flow
import React from 'react';
import classNames from 'classnames';
import defaultClasses from '../../d2Ui/divider/divider.mod.css';

type Props = {
    className?: ?string,
};

const DividerHorizontal = (props: Props) => {
    const { className, ...passOnProps } = props;
    const calculatedClassNames = classNames(defaultClasses.horizontal, props.className);

    return (
        <div
            className={calculatedClassNames}
            {...passOnProps}
        />
    );
};

export default DividerHorizontal;
