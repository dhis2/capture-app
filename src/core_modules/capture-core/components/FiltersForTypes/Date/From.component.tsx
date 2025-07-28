import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { D2Date } from '../../FormFields/DateAndTime/D2Date/D2Date.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';
import type { DateValue } from './types/date.types';

type Props = {
    value?: string;
    error?: string | null;
    errorClass?: string;
    onBlur: ({ from }: { from: DateValue }) => void;
};

class FromDateFilterPlain extends Component<Props> {
    static getValueObject(value: DateValue) {
        return { from: { ...value } };
    }

    handleBlur = (value: DateValue) => {
        this.props.onBlur(FromDateFilterPlain.getValueObject(value));
    }

    render() {
        const { error, errorClass, onBlur, ...passOnProps } = this.props;
        return (
            <div>
                <D2Date
                    onBlur={this.handleBlur}
                    placeholder={i18n.t('From')}
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

export const FromDateFilter = withInternalChangeHandler()(FromDateFilterPlain) as any;
