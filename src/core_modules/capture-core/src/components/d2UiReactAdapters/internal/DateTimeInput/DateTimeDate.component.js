// @flow
import React from 'react';
import withFocusSaver from '../../HOC/withFocusSaver';
import D2Date from '../../DateAndTimeFields/DateField/D2Date.component';
import withShrinkLabel from '../../HOC/withShrinkLabel';


function DateTimeDate(props) {
    const { value, ...passOnProps } = props;
    return (
        <D2Date
            value={value || ''}
            {...passOnProps}
        />
    );
}

export default withFocusSaver()(withShrinkLabel()(DateTimeDate));
