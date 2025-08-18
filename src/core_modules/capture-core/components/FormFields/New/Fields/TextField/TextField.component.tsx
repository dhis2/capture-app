import React, { Component } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { TextField as UITextField } from 'capture-ui';

const getStyles = () => ({
    inputWrapperFocused: {},
    inputWrapperUnfocused: {},
});

type Props = {
    value: string | null,
    onChange?: (value: string, event: React.SyntheticEvent<HTMLInputElement>) => void | null,
    onBlur?: (value: string, event: React.SyntheticEvent<HTMLInputElement>) => void | null,
};

class TextFieldPlain extends Component<Props & WithStyles<typeof getStyles>> {
    handleChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        this.props.onChange && this.props.onChange(event.currentTarget.value, event);
    }

    handleBlur = (event: React.SyntheticEvent<HTMLInputElement>) => {
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
                onSetFocus={() => {}}
                onRemoveFocus={() => {}}
                inFocus={false}
                onFocus={() => {}}
                {...passOnProps}
            />
        );
    }
}

export const TextField = withStyles(getStyles)(TextFieldPlain);
