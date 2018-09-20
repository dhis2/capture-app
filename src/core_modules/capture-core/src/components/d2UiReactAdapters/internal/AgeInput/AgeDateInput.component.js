// @flow
import React, { Component } from 'react';
import moment from 'moment';
import i18n from '@dhis2/d2-i18n';
import D2Date from '../../DateAndTimeFields/DateField/D2Date.component';
import orientations from '../../constants/orientations.const';
import withFocusSaver from '../../HOC/withFocusSaver';
import withFocusHandler from '../../internal/TextInput/withFocusHandler';
import defaultClasses from '../../../d2Ui/ageField/ageField.mod.css';

type Props = {
    value: ?string,
    onBlur: (value: string) => void,
    onChange?: ?(value: string) => void,
    orientation: $Values<typeof orientations>,
    classes?: ?any,
}

class AgeDateInput extends Component<Props> {
    handleBlur = (value) => {
        this.props.onBlur(value);
    }
    handleChange = (event) => {
        this.props.onChange && this.props.onChange(event.currentTarget.value);
    }

    render() {
        const { value, onAgeChanged, onChange, orientation, classes, ...passOnProps } = this.props;
        const width = orientation === orientations.VERTICAL ? 150 : 350;
        return (
            <D2Date
                value={value || ''}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                placeholder={i18n.t('mm/dd/yyyy')}
                width={width}
                calendarMaxMoment={moment()}
                {...passOnProps}
            />

        );
    }
}

export default withFocusSaver()(withFocusHandler()(AgeDateInput));
