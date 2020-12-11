// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import D2Date from '../../FormFields/DateAndTime/D2Date/D2Date.component';
import { modes, absoluteDirections } from '../../FormFields/DateAndTime/D2Date/d2DatePopup.const';
import withInternalChangeHandler from '../../FormFields/withInternalChangeHandler';

type Props = {
    value: ?string,
    error: ?string,
    onBlur: ({ from: string }) => void,
    onEnterKey: () => void,
    errorClass: string,
};

class FromDateFilter extends Component<Props> {
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
        this.props.onBlur(FromDateFilter.getValueObject(value));
    }

    handleKeyPress = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
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
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    placeholder={i18n.t('From')}
                    popupMode={modes.ABSOLUTE}
                    popupAbsoluteDirection={absoluteDirections.UP}
                    width={150}
                    calendarWidth={330}
                    calendarHeight={170}
                    calendarRowHeight={45}
                    calendarDisplayOptions={this.displayOptions}
                    {...passOnProps}
                />
                <div className={errorClass}>
                    {error}
                </div>
            </div>
        );
    }
}

export default withInternalChangeHandler()(FromDateFilter);
