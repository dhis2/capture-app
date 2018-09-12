// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { D2TextField } from '../../../../d2UiReactAdapters';

const getStyles = (theme: Theme) => ({
    inputWrapperFocused: {
        border: `2px solid ${theme.palette.accent.dark}`,
        borderRadius: '5px',
        backgroundColor: 'red',
    },
    inputWrapperUnfocused: {
        padding: 2,
    },
});

type Props = {
    value: ?string,
    onSetFocus: () => void,
    onRemoveFocus: () => void,
    inFocus: boolean,
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
        this.props.onRemoveFocus();
        this.props.onBlur && this.props.onBlur(event.currentTarget.value, event);
    }

    handleFocus = () => {
        this.props.onSetFocus();
    }

    render() {
        const {
            value,
            onBlur,
            onChange,
            classes,
            onSetFocus,
            onRemoveFocus,
            inFocus,
            ...passOnProps
        } = this.props;

        const { inputWrapperFocused, inputWrapperUnfocused, ...restClasses } = classes;
        const passOnClasses = { ...restClasses, inputWrapper: inFocus ? inputWrapperFocused : inputWrapperUnfocused };

        return (
            <D2TextField
                value={value || ''}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                classes={passOnClasses}
                {...passOnProps}
            />
        );
    }
}

export default withStyles(getStyles)(TextField);
