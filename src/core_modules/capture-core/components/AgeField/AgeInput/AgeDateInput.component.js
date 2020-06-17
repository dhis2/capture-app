// @flow
import React, { Component } from 'react';
import moment from 'moment';
import { DateField as UIDate, orientations, withFocusSaver } from 'capture-ui';

type Props = {
    value: ?string,
    onBlur: (value: string) => void,
    onChange?: ?(value: string) => void,
    orientation: $Values<typeof orientations>,
}

class AgeDateInput extends Component<Props> {
    render() {
        const { value, orientation, ...passOnProps } = this.props;
        return (
            <UIDate
                value={value || ''}
                calendarMaxMoment={moment()}
                width={150}
                calendarWidth={350}
                {...passOnProps}
            />

        );
    }
}

export default withFocusSaver()(AgeDateInput);
