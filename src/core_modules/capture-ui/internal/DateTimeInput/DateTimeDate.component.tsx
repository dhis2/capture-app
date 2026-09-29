import React from 'react';
import { withFocusSaver } from '../../HOC/withFocusSaver';
import { withTextFieldFocusHandler } from '../TextInput/withFocusHandler';
import { withShrinkLabel } from '../../HOC/withShrinkLabel';
import { DateField } from '../../DateAndTimeFields/DateField/Date.component';
import type { ValidationOptions } from '../../DateAndTimeFields/DateField/Date.types';

type Props = Readonly<{
    value?: any;
    onBlur: (value: any, options: ValidationOptions) => void;
    [key: string]: any;
}>

function DateTimeDatePlain({ value, ...passOnProps }: Props) {
    return (
        <DateField
            value={value}
            {...passOnProps}
        />
    );
}

export const DateTimeDate = withFocusSaver()(withShrinkLabel()(withTextFieldFocusHandler()(DateTimeDatePlain)));
