// @flow
import React from 'react';
import classNames from 'classnames';
import defaultClasses from '../../../d2Ui/internal/textInput/textInput.mod.css';

type Classes = {
    input?: ?string,
};

type Props = {
    multiLine?: ?boolean,
    classes: Classes,
    inputRef?: ?(ref: any) => void,
};

const TextInput = (props: Props) => {
    const { multiLine, classes, inputRef, ...passOnProps } = props;

    return (
        <React.Fragment>
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
        </React.Fragment>
    );
};

export default TextInput;
