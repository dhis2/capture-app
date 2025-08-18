import React from 'react';
import { withFocusSaver } from '../../HOC/withFocusSaver';
import { withTextFieldFocusHandler } from '../TextInput/withFocusHandler';
import { withShrinkLabel } from '../../HOC/withShrinkLabel';
import { DateField } from '../../DateAndTimeFields/DateField/Date.component';

type Props = {
    value?: any;
}

function DateTimeDatePlain(props: Props) {
    const { value, ...passOnProps } = props;

    return (
        <DateField
            value={value}
            {...passOnProps}
        />
    );
}

export const DateTimeDate = withFocusSaver()(withShrinkLabel()(withTextFieldFocusHandler()(DateTimeDatePlain)));
