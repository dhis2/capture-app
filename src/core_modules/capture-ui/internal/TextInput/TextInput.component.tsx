import React from 'react';
import classNames from 'classnames';
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
    [key: string]: any;
};

export const TextInput = (props: Props) => {
    const { multiLine, classes, inputRef, style, ...passOnProps } = props;

    return (
        <React.Fragment>
            {
                multiLine ?
                    <textarea
                        data-test="capture-ui-textarea"
                        ref={inputRef}
                        className={classNames(defaultClasses.textArea, classes?.input)}
                        {...passOnProps}
                    /> :
                    <input
                        ref={inputRef}
                        type="text"
                        className={classNames(defaultClasses.input, classes?.input)}
                        {...passOnProps}
                    />
            }
        </React.Fragment>
    );
};

TextInput.defaultProps = {
    classes: {},
};
