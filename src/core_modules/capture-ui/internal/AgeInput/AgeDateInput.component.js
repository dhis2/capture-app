// @flow
import moment from 'moment';
import React, { Component } from 'react';
import typeof { orientations } from '../../constants/orientations.const';
import { DateField } from '../../DateAndTimeFields/DateField/Date.component';
import { withFocusSaver } from '../../HOC/withFocusSaver';

type Props = {
    value: ?string,
    onBlur: (value: string) => void,
    onChange?: ?(value: string) => void,
    orientation: $Values<orientations>,
}

class AgeDateInputPlain extends Component<Props> {
    render() {
        const { value, orientation, ...passOnProps } = this.props;
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <DateField
                value={value || ''}
                calendarMaxMoment={moment()}
                width={150}
                calendarWidth={350}
                {...passOnProps}
            />

        );
    }
}

export const AgeDateInput = withFocusSaver()(AgeDateInputPlain);
