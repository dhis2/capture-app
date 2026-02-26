import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { D2Date } from '../../FormFields/DateAndTime/D2Date/D2Date.component';
import { getAgeFilterData } from './ageFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import type { AgeFilterProps, Value } from './Age.types';
import type { DateValue } from '../Date/types';

export class AgeFilter extends Component<AgeFilterProps> implements UpdatableFilterContent<Value> {
    onGetUpdateData(updatedValue?: Value) {
        const value = updatedValue === undefined ? this.props.value : updatedValue;
        return getAgeFilterData(value);
    }

    handleBlur = (dateValue: DateValue) => {
        if (dateValue?.value != null && dateValue?.value !== '') {
            this.props.onCommitValue(dateValue.value);
        }
    };

    handleDateSelectedFromCalendar = () => {
        this.props.onFocusUpdateButton?.();
    };

    render() {
        const { value } = this.props;

        return (
            <D2Date
                value={value ?? undefined}
                onBlur={this.handleBlur}
                placeholder={i18n.t('Date of birth')}
                inputWidth="150px"
                calendarWidth="330px"
                onDateSelectedFromCalendar={this.handleDateSelectedFromCalendar}
            />
        );
    }
}
