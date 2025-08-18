import React from 'react';
import { withTextFieldFocusHandler } from '../TextInput/withFocusHandler';
import { TextInput } from '../TextInput/TextInput.component';

type Props = {
    onBlur: (value: any) => void;
    onChange?: (value: any) => void;
    value?: any;
}

class DateInputPlain extends React.Component<Props> {
    handleBlur = (event: any) => {
        this.props.onBlur(event);
    }

    handleChange = (event: any) => {
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

export const DateInput = withTextFieldFocusHandler()(DateInputPlain);
