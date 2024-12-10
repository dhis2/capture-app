// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { D2TextField } from '../../FormFields/Generic/D2TextField.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';

type Props = {
    value: ?string,
    error: ?string,
    onBlur: ({ end: string }) => void,
    onEnterKey: ({ end: string }) => void,
    textFieldRef: (instance: any) => void,
    errorClass: string,
};

class EndRangeFilterPlain extends Component<Props> {
    static getValueObject(value: string) {
        return { end: value.trim() };
    }

    handleBlur = (value: string) => {
        this.props.onBlur(EndRangeFilterPlain.getValueObject(value));
    };

    handleKeyPress = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.props.onEnterKey(EndRangeFilterPlain.getValueObject(this.props.value || ''));
        }
    };

    render() {
        const { error, onBlur, onEnterKey, textFieldRef, errorClass, ...passOnProps } = this.props;
        return (
            <div>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <D2TextField
                    ref={textFieldRef}
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    placeholder={i18n.t('Days in the future')}
                    fullWidth
                    dataTest="date-range-filter-end"
                    {...passOnProps}
                />
                <div className={errorClass}>{error}</div>
            </div>
        );
    }
}

export const EndRangeFilter = withInternalChangeHandler()(EndRangeFilterPlain);
