// @flow
import React, { Component } from 'react';
import { TextInput, withShrinkLabel, withFocusSaver, withFocusHandler } from 'capture-ui';

type Props = {
    label: string,
    value: ?string,
    onBlur: (value: string) => void,
    onChange?: ?((value: string) => void),
    classes?: ?any,
}

type State = {
    focus?: ?boolean,
}

class AgeNumberInput extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = { focus: false };
    }
    handleBlur = (event) => {
        this.props.onBlur(event.currentTarget.value);
        this.setState({ focus: false });
    }
    handleChange = (event) => {
        this.props.onChange && this.props.onChange(event.currentTarget.value);
    }
    handleFocus = () => {
        this.setState({ focus: true });
    }
    render() {
        const { onBlur, onChange, value, classes, ...passOnProps } = this.props;
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <TextInput
                classes={{}}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                value={value || ''}
                {...passOnProps}
            />
        );
    }
}

export default withFocusSaver()(withShrinkLabel()(withFocusHandler()(AgeNumberInput)));
