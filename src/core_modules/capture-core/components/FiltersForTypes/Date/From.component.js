// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { D2Date } from '../../FormFields/DateAndTime/D2Date/D2Date.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';

type Props = {
    value: ?string,
    error: ?string,
    onBlur: ({ from: string }) => void,
    onEnterKey: () => void,
    errorClass: string,
};

class FromDateFilterPlain extends Component<Props> {
    static getValueObject(value: string) {
        return { from: value.trim() };
    }
    displayOptions: Object;
    constructor(props: Props) {
        super(props);
        this.displayOptions = {
            showWeekdays: true,
            showHeader: false,
        };
    }

    handleBlur = (value: string) => {
        this.props.onBlur(FromDateFilterPlain.getValueObject(value));
    }

    handleKeyDown = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.props.onEnterKey();
        }
    }

    render() {
        const { error, errorClass, onBlur, onEnterKey, ...passOnProps } = this.props;
        return (
            <div>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <D2Date
                    onKeyDown={this.handleKeyDown}
                    onBlur={this.handleBlur}
                    placeholder={i18n.t('From')}
                    width={150}
                    calendarWidth={330}
                    {...passOnProps}
                />
                <div className={errorClass}>
                    {error}
                </div>
            </div>
        );
    }
}

export const FromDateFilter = withInternalChangeHandler()(FromDateFilterPlain);
