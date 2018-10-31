// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import VirtualizedSelect from '../../../Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
import withFocusHandler from './withFocusHandler';

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
    onChange?: any,
    onBlur?: ?(value: any) => void,
    classes: {
        inputWrapperFocused: string,
        inputWrapperUnfocused: string,
    },
};

const VirtualizedSelectComponent =
    withFocusHandler()(
        VirtualizedSelect,
    );

class VirtualizedSelectField extends Component<Props> {
    handleSelect = (value: any) => {
        this.props.onBlur && this.props.onBlur(value);
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
            <VirtualizedSelectComponent
                value={value || ''}
                onSelect={this.handleSelect}
                classes={classes}
                {...passOnProps}
            />
        );
    }
}

export default withStyles(getStyles)(VirtualizedSelectField);
