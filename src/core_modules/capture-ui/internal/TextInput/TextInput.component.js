// @flow
import React from 'react';
import classNames from 'classnames';
import defaultClasses from './textInput.module.css';

type Classes = {
    input?: ?string,
};

type Props = {
    multiLine?: ?boolean,
    classes: Classes,
    inputRef?: ?(ref: any) => void,
    style?: ?Object,
    disabled?: ?boolean,
};

export const TextInput = (props: Props) => {
    const { multiLine, classes, inputRef, style, ...passOnProps } = props;

    return (
        <React.Fragment>
            {
                multiLine ?
                    // $FlowFixMe[cannot-spread-inexact] automated comment
                    <textarea
                        data-test="capture-ui-textarea"
                        ref={inputRef}
                        className={classNames(defaultClasses.textArea, classes.input)}
                        {...passOnProps}
                    /> :
                    // $FlowFixMe[cannot-spread-inexact] automated comment
                    <input
                        ref={inputRef}
                        type="text"
                        className={classNames(defaultClasses.input, classes.input)}
                        {...passOnProps}
                    />
            }
        </React.Fragment>
    );
};

TextInput.defaultProps = {
    classes: {},
};
