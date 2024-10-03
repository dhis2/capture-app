// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { D2Date } from '../../FormFields/DateAndTime/D2Date/D2Date.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';
import { type DateValue } from './types/date.types';

type Props = {
    value: ?string,
    onBlur: ({ to: DateValue }) => void,
    textFieldRef: (instance: any) => void,
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
        const { onBlur, onFocusUpdateButton, ...passOnProps } = this.props;
        return (
            <div>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <D2Date
                    onBlur={this.handleBlur}
                    onDateSelectedFromCalendar={this.handleDateSelectedFromCalendar}
                    placeholder={i18n.t('To')}
                    inputWidth={50}
                    calendarWidth={330}
                    {...passOnProps}
                />
            </div>
        );
    }
}

export const ToDateFilter = withInternalChangeHandler()(ToDateFilterPlain);
