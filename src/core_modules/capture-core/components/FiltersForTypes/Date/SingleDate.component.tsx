import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { D2Date } from '../../FormFields/DateAndTime/D2Date/D2Date.component';
import type { DateValue } from './types/date.types';

type Props = {
    value?: string | null;
    error?: string | null;
    errorClass?: string;
    onBlur: ({ date }: { date: DateValue }) => void;
    onEnterKey: () => void;
    onDateSelectedFromCalendar: () => void;
};

class SingleDateFilterPlain extends Component<Props> {
    handleBlur = (dateValue: DateValue) => {
        this.props.onBlur({ date: dateValue });
    };

    render() {
        const { error, errorClass, onBlur, value, ...passOnProps } = this.props;
        return (
            <div>
                <D2Date
                    value={value ?? undefined}
                    onBlur={this.handleBlur}
                    placeholder={i18n.t('Date')}
                    inputWidth="150px"
                    calendarWidth="330px"
                    {...passOnProps}
                />
                <div className={errorClass}>
                    {error ? i18n.t('Please provide a valid date') : error}
                </div>
            </div>
        );
    }
}

export const SingleDateFilter = SingleDateFilterPlain;
