import React, { Component } from 'react';
import { withStyles, WithStyles } from 'capture-core-utils/styles';
import { OptionsSelectVirtualized } from '../../../Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
import { withFocusHandler } from './withFocusHandler';

const getStyles = () => ({
});

type Props = {
    value: string | null,
    onChange?: any,
    onBlur?: (value: any) => void | null,
};

const VirtualizedSelectComponent =
    withFocusHandler()(
        OptionsSelectVirtualized,
    ) as any;

class VirtualizedSelectFieldPlain extends Component<Props & WithStyles<typeof getStyles>> {
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

export const VirtualizedSelectField = withStyles(getStyles)(VirtualizedSelectFieldPlain);
