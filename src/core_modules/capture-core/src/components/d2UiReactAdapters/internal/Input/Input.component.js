// @flow
import React from 'react';
import classNames from 'classnames';
import defaultClasses from '../../../d2Ui/internal/input/input.mod.css';

type Classes = {
    input?: ?string,
    inputWrapper?: ?string,
};

type Props = {
    classes: Classes,
    inputRef?: ?(ref: any) => void,
};

const Input = (props: Props) => {
    const { classes, inputRef, ...passOnProps } = props;

    return (
        <div
            className={classNames(defaultClasses.inputWrapper, classes.inputWrapper)}
        >
            <input
                ref={inputRef}
                className={classNames(defaultClasses.input, classes.input)}
                {...passOnProps}
            />
        </div>
    );
};

export default Input;
