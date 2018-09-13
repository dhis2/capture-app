// @flow
import React, { Component } from 'react';
import moment from 'moment';
import i18n from '@dhis2/d2-i18n';
import D2Date from '../../DateAndTimeFields/DateField/D2Date.component';
import withInternalChangeHandler from '../../HOC/withInternalChangeHandler';

type Props = {
    value: ?string,
    onAgeChanged: (value: string) => void,
}

class AgeDateInput extends Component<Props> {
    handleBlur = (value) => {
        this.props.onAgeChanged(value);
    }

    render() {
        const { value, onAgeChanged, ...passOnProps } = this.props;
        return (
            <D2Date
                value={value}
                onBlur={this.handleBlur}
                placeholder={i18n.t('mm/dd/yyyy')}
                width={350}
                calendarMaxMoment={moment()}
                {...passOnProps}
            />
        );
    }
}

export default withInternalChangeHandler()(AgeDateInput);
