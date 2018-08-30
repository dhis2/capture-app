// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { D2TextField } from '../../../../d2UiReactAdapters';

const getStyles = (theme: Theme) => ({
    inputWrapperActive: {
        border: `2px solid ${theme.palette.accent.dark}`,
        borderRadius: '5px',
        backgroundColor: 'red',
    },
    inputWrapperInactive: {
        padding: 2,
    },
});

type Props = {
    value: ?string,
    onSetActive: () => void,
    onSetInactive: () => void,
    active: boolean,
    onChange?: ?(value: string, event: SyntheticEvent<HTMLInputElement>) => void,
    onBlur?: ?(value: string, event: SyntheticEvent<HTMLInputElement>) => void,
    classes: {
        inputWrapperActive: string,
        inputWrapperInactive: string,
    },
};

class TextField extends Component<Props> {
    inputInstance: HTMLInputElement;

    componentDidMount() {
        this.inputInstance.addEventListener('focus', this.handleInputFocus);
        this.inputInstance.addEventListener('blur', this.handleInputBlur);
    }

    componentWillUnmount() {
        this.inputInstance.removeEventListener('focus', this.handleInputFocus);
        this.inputInstance.removeEventListener('blur', this.handleInputBlur);
    }

    handleInputFocus = () => {
        this.props.onSetActive();
    }

    handleInputBlur = () => {
        this.props.onSetInactive();
    }

    handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
        this.props.onChange && this.props.onChange(event.currentTarget.value, event);
    }

    handleBlur = (event: SyntheticEvent<HTMLInputElement>) => {
        this.props.onBlur && this.props.onBlur(event.currentTarget.value, event);
    }

    setInputRef = (inputInstance) => {
        this.inputInstance = inputInstance;
    }

    render() {
        const {
            value,
            onBlur,
            onChange,
            classes,
            onSetActive,
            onSetInactive,
            active,
            ...passOnProps
        } = this.props;

        const { inputWrapperActive, inputWrapperInactive, ...restClasses } = classes;
        const passOnClasses = { ...restClasses, inputWrapper: active ? inputWrapperActive : inputWrapperInactive };

        return (
            <D2TextField
                inputRef={this.setInputRef}
                value={value || ''}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                classes={passOnClasses}
                {...passOnProps}
            />
        );
    }
}

export default withStyles(getStyles)(TextField);
