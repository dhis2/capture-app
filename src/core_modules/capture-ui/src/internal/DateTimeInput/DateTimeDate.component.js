// @flow
import React from 'react';
import withFocusSaver from '../../HOC/withFocusSaver';
import UIDate from '../../DateAndTimeFields/DateField/Date.component';
import withShrinkLabel from '../../HOC/withShrinkLabel';


function DateTimeDate(props) {
    const { value, ...passOnProps } = props;
    return (
        <UIDate
            value={value || ''}
            {...passOnProps}
        />
    );
}

export default withFocusSaver()(withShrinkLabel()(DateTimeDate));
