// @flow
import React from 'react';
import { InputField } from '@dhis2-ui/input';
import { withFocusSaver } from '../../HOC/withFocusSaver';
import { withTextFieldFocusHandler } from '../TextInput/withFocusHandler';
import { withShrinkLabel } from '../../HOC/withShrinkLabel';

type Props = {
    onBlur: (value: any) => void,
    onChange?: ?(value: any) => void,
}

class DateTimeTimePlain extends React.Component<Props> {
    handleBlur = (event) => {
        this.props.onBlur(event.value);
    }

    handleChange = (event) => {
        this.props.onChange && this.props.onChange(event.value);
    }

    render() {
        // $FlowFixMe[prop-missing] automated comment
        const { onBlur, onChange, value, innerMessage, ...passOnProps } = this.props;
        const errorProps = innerMessage
            ? { error: !!innerMessage.message?.errorMessage?.timeError, validationText: innerMessage.message?.errorMessage?.timeError }
            : {};

        return (
            <InputField
                {...passOnProps}
                value={value || ''}
                label=""
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                {...errorProps}
            />
        );
    }
}

export const DateTimeTime =
    withFocusSaver()(withShrinkLabel()(withTextFieldFocusHandler()(DateTimeTimePlain)));
