import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { D2TextField } from '../../FormFields/Generic/D2TextField.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';

type Props = {
    value: string,
    error: string | null,
    onBlur: ({ min }: { min: string }) => void,
    onEnterKey: (value: { min: string }) => void,
    errorClass: string,
};

class MinNumericFilterPlain extends Component<Props> {
    static getValueObject(value: string) {
        return { min: value.trim() };
    }

    handleBlur = (value: string) => {
        this.props.onBlur(MinNumericFilterPlain.getValueObject(value));
    }

    handleKeyDown = (payload: { value?: string }, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.props.onEnterKey(MinNumericFilterPlain.getValueObject(payload.value ?? this.props.value ?? ''));
        }
    }

    render() {
        const { error, errorClass, onBlur, onEnterKey, ...passOnProps } = this.props;
        return (
            <div>
                <D2TextField
                    onKeyDown={this.handleKeyDown}
                    onBlur={this.handleBlur}
                    placeholder={i18n.t('Min')}
                    {...passOnProps}
                />
                <div className={errorClass}>
                    {error}
                </div>
            </div>
        );
    }
}

export const MinNumericFilter = withInternalChangeHandler()(MinNumericFilterPlain);
