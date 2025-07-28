import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { D2TextField } from '../../FormFields/Generic/D2TextField.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';

type Props = {
    value?: string | null;
    error?: string | null;
    onBlur: ({ end }: { end: string }) => void;
    onEnterKey: ({ end }: { end: string }) => void;
    textFieldRef: (instance: any) => void;
    errorClass: string;
};

class EndRangeFilterPlain extends Component<Props> {
    static getValueObject(value: string) {
        return { end: value.trim() };
    }

    handleBlur = (value: string) => {
        this.props.onBlur(EndRangeFilterPlain.getValueObject(value));
    };

    render() {
        const { error, onBlur, onEnterKey, textFieldRef, errorClass, ...passOnProps } = this.props;
        return (
            <div>
                <D2TextField
                    ref={textFieldRef}
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
