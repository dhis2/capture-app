import React from 'react';
import defaultClasses from './textField.module.css';
import { TextInput } from '../internal/TextInput/TextInput.component';
import { withTextFieldFocusHandler } from '../internal/TextInput/withFocusHandler';

type Classes = {
    input?: string | null;
    inputWrapper?: string | null;
};

type Props = {
    classes?: Classes | null;
    inputRef?: ((ref: any) => void) | null;
    [key: string]: any;
};

class D2TextField extends React.Component<Props> {
    render() {
        const { classes: optionalClasses, ...passOnProps } = this.props;
        const classes = optionalClasses || {};

        return (
            <div
                className={defaultClasses.container}
            >
                <TextInput
                    classes={classes}
                    {...passOnProps}
                />
            </div>
        );
    }
}

export const TextField = withTextFieldFocusHandler()(D2TextField);
