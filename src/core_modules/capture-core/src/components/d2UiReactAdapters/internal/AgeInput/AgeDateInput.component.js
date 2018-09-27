// @flow
import React, { Component } from 'react';
import moment from 'moment';
import i18n from '@dhis2/d2-i18n';
import D2Date from '../../DateAndTimeFields/DateField/D2Date.component';
import orientations from '../../constants/orientations.const';
import withFocusSaver from '../../HOC/withFocusSaver';

type Props = {
    value: ?string,
    onBlur: (value: string) => void,
    onChange?: ?(value: string) => void,
    orientation: $Values<typeof orientations>,
}

class AgeDateInput extends Component<Props> {
    render() {
        const { value, orientation, ...passOnProps } = this.props;
        const width = orientation === orientations.VERTICAL ? 150 : null;
        return (
            <D2Date
                value={value || ''}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                placeholder={i18n.t('mm/dd/yyyy')}
                calendarMaxMoment={moment()}
                width={width}
                calendarWidth={350}
                {...passOnProps}
            />

        );
    }
}

export default withFocusSaver()(AgeDateInput);
