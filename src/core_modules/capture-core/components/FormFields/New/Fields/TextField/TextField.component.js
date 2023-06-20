// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TextField as UITextField } from 'capture-ui';

const getStyles = () => ({
});

type Props = {
    value: ?string,
    onChange?: ?(value: string, event: SyntheticEvent<HTMLInputElement>) => void,
    onBlur?: ?(value: string, event: SyntheticEvent<HTMLInputElement>) => void,
    classes: {
        inputWrapperFocused: string,
        inputWrapperUnfocused: string,
    },
};

class TextFieldPlain extends Component<Props> {
    handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
        this.props.onChange && this.props.onChange(event.currentTarget.value, event);
    }

    handleBlur = (event: SyntheticEvent<HTMLInputElement>) => {
        this.props.onBlur && this.props.onBlur(event.currentTarget.value, event);
    }

    render() {
        const {
            value,
            onBlur,
            onChange,
            classes,
            ...passOnProps
        } = this.props;

        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <UITextField
                value={value || ''}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                classes={classes}
                {...passOnProps}
            />
        );
    }
}

export const TextField = withStyles(getStyles)(TextFieldPlain);
