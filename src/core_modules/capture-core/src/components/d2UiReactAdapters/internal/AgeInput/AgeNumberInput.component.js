// @flow
import React, { Component } from 'react';
import TextInput from '../TextInput/TextInput.component';
import withInternalChangeHandler from '../../HOC/withInternalChangeHandler';
import withAgeInputMessage from './withAgeInputMessage';
import ShrinkLabel from '../ShrinkLabel/ShrinkLabel.component';

type Props = {
    label: string,
    value: ?string,
    onBlur: (value: string) => void,
    onChange: (value: string) => void,
}

type State = {
    focus?: ?boolean,
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
        this.props.onChange(event.currentTarget.value);
    }
    handleFocus = (event) => {
        this.setState({ focus: true });
    }
    render() {
        const { onBlur, label, onChange, ...passOnProps } = this.props;
        return (
            <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column' }}>
                <ShrinkLabel
                    shrink={this.state.focus}
                >
                    {label}
                </ShrinkLabel>
                <div style={{ marginTop: 16 }}>
                    <TextInput
                        classes={{}}
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        {...passOnProps}
                    />
                </div>

            </div>

        );
    }
}

export default withInternalChangeHandler()(withAgeInputMessage()(AgeNumberInput));
