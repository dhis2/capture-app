// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { OptionsSelectVirtualized } from '../../../Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
import { withFocusHandler } from './withFocusHandler';

const getStyles = () => ({
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
        OptionsSelectVirtualized,
    );

class VirtualizedSelectFieldPlain extends Component<Props> {
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

export const VirtualizedSelectField = withStyles(getStyles)(VirtualizedSelectFieldPlain);
