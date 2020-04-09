// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { TextField as UITextField } from 'capture-ui';

const getStyles = (theme: Theme) => ({
    inputWrapperFocused: {
        border: `2px solid ${theme.palette.primary.light}`,
        borderRadius: '5px',
    },
    inputWrapperUnfocused: {
        padding: 2,
    },
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

class TextField extends Component<Props> {
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

export default withStyles(getStyles)(TextField);
