// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { MultiSelectField } from '../../../Options/MultiSelectField/MultiSelectField.component';
// import { OptionsSelectVirtualized } from '../../../Options/MultiSelectField/OptionsSelectVirtualized.component';
import { withFocusHandler } from './withFocusHandler';

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
        MultiSelectField,
    );

class VirtualizedMultiSelectFieldPlain extends Component<Props> {
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
        // const testValue = 'HIV,Malaria';
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <VirtualizedSelectComponent
                value={value || ''}
                onSelect={this.handleSelect}
                classes={classes}
                {...passOnProps}
            />
        );
    }
}

export const VirtualizedMultiSelectField = withStyles(getStyles)(VirtualizedMultiSelectFieldPlain);
