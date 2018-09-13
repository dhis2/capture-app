// @flow
import React, { Component } from 'react';
import TextInput from '../TextInput/TextInput.component';
import withInternalChangeHandler from '../../HOC/withInternalChangeHandler';
import ShrinkLabel from '../ShrinkLabel/ShrinkLabel.component';

type Props = {
    label: string,
    value: ?string,
    onBlur: (value: string) => void,
}

class AgeNumberInput extends Component<Props> {
    handleBlur = (event) => {
        this.props.onBlur(event.currentTarget.value);
    }
    render() {
        const { onBlur, label, ...passOnProps } = this.props;
        return (
            <div>
                <ShrinkLabel
                    shrink={false}
                >
                    {label}
                </ShrinkLabel>
                <TextInput
                    classes={{}}
                    onBlur={this.handleBlur}
                    {...passOnProps}
                />
            </div>

        );
    }
}

export default withInternalChangeHandler()(AgeNumberInput);
