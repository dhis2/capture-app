import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { D2TextField } from '../../FormFields/Generic/D2TextField.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';

type Props = {
    value?: string | null;
    error?: string | null;
    onBlur: ({ start }: { start: string }) => void;
    onEnterKey: () => void;
    errorClass: string;
};

class StartRangeFilterPlain extends Component<Props> {
    static getValueObject(value: string) {
        return { start: value.trim() };
    }

    handleBlur = (value: string) => {
        this.props.onBlur(StartRangeFilterPlain.getValueObject(value));
    };

    handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.props.onEnterKey();
        }
    };

    render() {
        const { error, errorClass, onBlur, onEnterKey, ...passOnProps } = this.props;
        return (
            <div>
                <D2TextField
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    placeholder={i18n.t('Days in the past')}
                    fullWidth
                    dataTest="date-range-filter-start"
                    {...passOnProps}
                />
                <div className={errorClass}>{error}</div>
            </div>
        );
    }
}

export const StartRangeFilter = withInternalChangeHandler()(StartRangeFilterPlain);
