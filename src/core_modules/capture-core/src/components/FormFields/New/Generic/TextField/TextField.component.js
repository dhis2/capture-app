// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { D2TextField, withLabel } from '../../../../d2UiReactAdapters';

const getStyles = (theme: Theme) => ({
    label: {
        color: theme.palette.text.primary,
    },
});

type Props = {
    value: ?string,
    onChange?: ?(value: string, event: SyntheticEvent<HTMLInputElement>) => void,
    onBlur?: ?(value: string, event: SyntheticEvent<HTMLInputElement>) => void,
};

class TextField extends Component<Props> {
    handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
        this.props.onChange && this.props.onChange(event.currentTarget.value, event);
    }

    handleBlur = (event: SyntheticEvent<HTMLInputElement>) => {
        this.props.onBlur && this.props.onBlur(event.currentTarget.value, event);
    }

    render() {
        const { value, onBlur, onChange, ...passOnProps } = this.props;

        return (
            <D2TextField
                value={value || ''}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                {...passOnProps}
            />
        );
    }
}

export default withStyles(getStyles)(TextField);

export const TextFieldWithLabel =
    withStyles(getStyles)(
        withLabel()(TextField),
    );
