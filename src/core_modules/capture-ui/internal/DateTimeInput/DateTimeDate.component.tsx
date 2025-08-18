import React from 'react';
import { withFocusSaver } from '../../HOC/withFocusSaver';
import { withTextFieldFocusHandler } from '../TextInput/withFocusHandler';
import { withShrinkLabel } from '../../HOC/withShrinkLabel';
import { DateField } from '../../DateAndTimeFields/DateField/Date.component';
import type { ValidationOptions } from '../../DateAndTimeFields/DateField/Date.types';

type Props = {
    value?: any;
    width?: number;
    onBlur: (value: any, options: ValidationOptions) => void;
    [key: string]: any;
}

function DateTimeDatePlain(props: Props) {
    const { value, ...passOnProps } = props;

    return (
        <DateField
            value={value}
            width={150}
            {...passOnProps}
        />
    );
}

export const DateTimeDate = withFocusSaver()(withShrinkLabel()(withTextFieldFocusHandler()(DateTimeDatePlain)));
