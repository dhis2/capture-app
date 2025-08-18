import React, { Component } from 'react';
import { DateField } from '../../DateAndTimeFields/DateField/Date.component';
import type { orientations } from '../../constants/orientations.const';
import { withFocusSaver } from '../../HOC/withFocusSaver';

type Props = {
    value?: string | null;
    onBlur: (value: string) => void;
    onChange?: (value: string) => void;
    orientation: typeof orientations[keyof typeof orientations];
    calendarWidth?: string;
    placeholder?: string;
}

class AgeDateInputPlain extends Component<Props> {
    render() {
        const { value, orientation, ...passOnProps } = this.props;
        return (
            <DateField
                value={value || ''}
                width="150px"
                calendarWidth="350px"
                {...passOnProps}
            />

        );
    }
}

export const AgeDateInput = withFocusSaver()(AgeDateInputPlain);
