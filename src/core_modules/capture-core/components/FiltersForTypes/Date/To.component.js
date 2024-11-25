// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { D2Date } from '../../FormFields/DateAndTime/D2Date/D2Date.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';
import { type DateValue } from './types/date.types';

type Props = {
    value: ?DateValue,
    error: ?string,
    errorClass: ?string,
    onBlur: ({ to: DateValue }) => void,
    onFocusUpdateButton: () => void,
};

class ToDateFilterPlain extends Component<Props> {
    static getValueObject(value: DateValue) {
        return { to: { ...value } };
    }

    handleBlur = (value: DateValue) => {
        this.props.onBlur(ToDateFilterPlain.getValueObject(value));
    }

    handleDateSelectedFromCalendar = () => {
        this.props.onFocusUpdateButton();
    }

    render() {
        const { error, errorClass, onBlur, onFocusUpdateButton, ...passOnProps } = this.props;
        return (
            <div>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <D2Date
                    onBlur={this.handleBlur}
                    onDateSelectedFromCalendar={this.handleDateSelectedFromCalendar}
                    placeholder={i18n.t('To')}
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

export const ToDateFilter = withInternalChangeHandler()(ToDateFilterPlain);
