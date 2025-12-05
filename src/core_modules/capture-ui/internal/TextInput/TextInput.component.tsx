import React from 'react';
import { cx } from '@emotion/css';
import defaultClasses from './textInput.module.css';

type Classes = {
    input?: string | null;
};

type Props = {
    multiLine?: boolean | null;
    classes?: Classes;
    inputRef?: ((ref: any) => void) | null;
    style?: any;
    disabled?: boolean;
    label?: any;
    [key: string]: any;
};

export const TextInput = (props: Props) => {
    const { multiLine, classes = {}, inputRef, style, disabled, ...passOnProps } = props;
    return (
        <React.Fragment>
            {
                multiLine ?
                    <textarea
                        data-test="capture-ui-textarea"
                        ref={inputRef}
                        className={cx(defaultClasses.textArea, classes.input)}
                        disabled={disabled}
                        {...passOnProps}
                    /> :
                    <input
                        ref={inputRef}
                        type="text"
                        className={cx(defaultClasses.input, classes.input)}
                        disabled={disabled}
                        {...passOnProps}
                    />
            }
        </React.Fragment>
    );
};

