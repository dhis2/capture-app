// @flow
import React, { Component } from 'react';
import moment from 'moment';
import i18n from '@dhis2/d2-i18n';
import D2Date from '../../DateAndTimeFields/DateField/D2Date.component';
import withInternalChangeHandler from '../../HOC/withInternalChangeHandler';
import withAgeInputContainer from './withAgeInputContainer';
import orientations from '../../constants/orientations.const';

type Props = {
    value: ?string,
    onAgeChanged: (value: string) => void,
    onChange?: ?(value: string) => void,
    orientation: $Values<typeof orientations>,
}

class AgeDateInput extends Component<Props> {
    handleBlur = (value) => {
        this.props.onAgeChanged(value);
    }
    handleChange = (event) => {
        this.props.onChange && this.props.onChange(event.currentTarget.value);
    }

    render() {
        const { value, onAgeChanged, onChange, orientation, ...passOnProps } = this.props;
        const width = orientation === orientations.VERTICAL ? 150 : 350;
        return (
            <div>
                <D2Date
                    value={value || ''}
                    onBlur={this.handleBlur}
                    onChange={this.handleChange}
                    placeholder={i18n.t('mm/dd/yyyy')}
                    width={width}
                    calendarMaxMoment={moment()}
                    {...passOnProps}
                />
            </div>

        );
    }
}

export default withInternalChangeHandler()(withAgeInputContainer()(AgeDateInput));
