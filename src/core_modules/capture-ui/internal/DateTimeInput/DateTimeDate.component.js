// @flow
import React from 'react';
import { withFocusSaver } from '../../HOC/withFocusSaver';
import { DateField } from '../../DateAndTimeFields/DateField/Date.component';
import { withShrinkLabel } from '../../HOC/withShrinkLabel';


function DateTimeDatePlain(props) {
    const { value, ...passOnProps } = props;
    return (
        <DateField
            value={value || ''}
            {...passOnProps}
        />
    );
}

export const DateTimeDate = withFocusSaver()(withShrinkLabel()(DateTimeDatePlain));
