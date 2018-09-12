// @flow
import React from 'react';
import classNames from 'classnames';
import defaultClasses from '../../../d2Ui/internal/textInput/textInput.mod.css';

type Classes = {
    input?: ?string,
    inputWrapper?: ?string,
};

type Props = {
    multiLine?: ?boolean,
    classes: Classes,
    inputRef?: ?(ref: any) => void,
};

const TextInput = (props: Props) => {
    const { multiLine, classes, inputRef, ...passOnProps } = props;

    return (
        <div
            className={classNames(defaultClasses.inputWrapper, classes.inputWrapper)}
        >
            {
                multiLine ?
                    <textarea
                        ref={inputRef}
                        className={classNames(defaultClasses.textArea, classes.input)}
                        {...passOnProps}
                    /> :
                    <input
                        ref={inputRef}
                        className={classNames(defaultClasses.input, classes.input)}
                        {...passOnProps}
                    />
            }
        </div>
    );
};

export default TextInput;
