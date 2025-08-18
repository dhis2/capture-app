import React, { Component } from 'react';
import { TextInput } from '../TextInput/TextInput.component';
import { withShrinkLabel } from '../../HOC/withShrinkLabel';
import { withFocusSaver } from '../../HOC/withFocusSaver';
import { withTextFieldFocusHandler } from '../../internal/TextInput/withFocusHandler';


type Props = {
    value?: string | null;
    onBlur: (value: string) => void;
    onChange?: (value: string) => void;
    classes?: any;
    label?: string;
    shrinkDisabled?: boolean;
}

class AgeNumberInputPlain extends Component<Props> {
    handleBlur = (event: any) => {
        this.props.onBlur(event.currentTarget.value);
    }
    handleChange = (event: any) => {
        this.props.onChange && this.props.onChange(event.currentTarget.value);
    }
    render() {
        const { onBlur, onChange, value, classes, ...passOnProps } = this.props;
        return (
            <TextInput
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                value={value || ''}
                {...passOnProps}
            />
        );
    }
}

export const AgeNumberInput =
    withFocusSaver()(withShrinkLabel()(withTextFieldFocusHandler()(AgeNumberInputPlain)));
