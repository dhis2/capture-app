// @flow
import React, { Component } from 'react';
import moment from 'moment';
import i18n from '@dhis2/d2-i18n';
import D2Date from '../../DateAndTimeFields/DateField/D2Date.component';
import withInternalChangeHandler from '../../HOC/withInternalChangeHandler';
import withAgeInputMessage from './withAgeInputMessage';

type Props = {
    value: ?string,
    onAgeChanged: (value: string) => void,
    onChange: (value: string) => void,
}

class AgeDateInput extends Component<Props> {
    handleBlur = (value) => {
        this.props.onAgeChanged(value);
    }
    handleChange = (event) => {
        this.props.onChange(event.currentTarget.value);
    }

    render() {
        const { value, onAgeChanged, onChange, ...passOnProps } = this.props;
        return (
            <div>
                <D2Date
                    value={value}
                    onBlur={this.handleBlur}
                    onChange={this.handleChange}
                    placeholder={i18n.t('mm/dd/yyyy')}
                    width={350}
                    calendarMaxMoment={moment()}
                    {...passOnProps}
                />
            </div>

        );
    }
}

export default withInternalChangeHandler()(withAgeInputMessage()(AgeDateInput));
