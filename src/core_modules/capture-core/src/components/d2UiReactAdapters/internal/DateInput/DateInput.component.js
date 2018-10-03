// @flow
import React from 'react';
import withFocusHandler from '../TextInput/withFocusHandler';
import TextInput from '../TextInput/TextInput.component';

type Props = {
    onBlur: (value: any) => void,
    onChange?: ?(value: any) => void,
}

class DateInput extends React.Component<Props> {
    handleBlur = (event) => {
        this.props.onBlur(event);
    }

    handleChange = (event) => {
        this.props.onChange && this.props.onChange(event.currentTarget.value);
    }

    render() {
        const { onBlur, onChange, value, ...passOnProps } = this.props;
        return (
            <TextInput
                value={value || ''}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                {...passOnProps}
            />
        );
    }
}

export default withFocusHandler()(DateInput);
