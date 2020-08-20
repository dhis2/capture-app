// @flow
import React, { Component } from 'react';
import TextInput from '../TextInput/TextInput.component';
import withShrinkLabel from '../../HOC/withShrinkLabel';
import withFocusSaver from '../../HOC/withFocusSaver';
import withFocusHandler from '../../internal/TextInput/withFocusHandler';


type Props = {
    label: string,
    value: ?string,
    onBlur: (value: string) => void,
    onChange?: ?((value: string) => void),
    classes?: ?any,
    className: string,
}


class CoordinateInput extends Component<Props> {
    handleBlur = (event) => {
        this.props.onBlur(event.currentTarget.value);
    }
    handleChange = (event) => {
        this.props.onChange && this.props.onChange(event.currentTarget.value);
    }
    render() {
        const { onBlur, onChange, value, classes, className, ...passOnProps } = this.props;
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <TextInput
                classes={{ input: className }}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                value={value || ''}
                {...passOnProps}
            />
        );
    }
}

export default withFocusSaver()(withShrinkLabel()(withFocusHandler()(CoordinateInput)));
