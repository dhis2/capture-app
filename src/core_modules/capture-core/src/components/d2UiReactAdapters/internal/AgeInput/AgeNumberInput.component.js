// @flow
import React, { Component } from 'react';
import TextInput from '../TextInput/TextInput.component';
import withShrinkLabel from '../../HOC/withShrinkLabel';
import withAgeInputContainer from './withAgeInputContainer';
import ShrinkLabel from '../ShrinkLabel/ShrinkLabel.component';
import withFocusSaver from '../../HOC/withFocusSaver';
import withFocusHandler from '../../internal/TextInput/withFocusHandler';


type Props = {
    label: string,
    value: ?string,
    onBlur: (value: string) => void,
    onChange?: ?(value: string) => void,
    classes?: ?any,
}

type State = {
    focus?: ?boolean,
    hasValue?: ?boolean,
}

class AgeNumberInput extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {};
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

export default withFocusSaver()(withShrinkLabel()(withFocusHandler()(withAgeInputContainer()(AgeNumberInput))));
