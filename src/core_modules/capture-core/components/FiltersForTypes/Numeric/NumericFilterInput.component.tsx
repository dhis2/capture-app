import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { D2TextField } from '../../FormFields/Generic/D2TextField.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';

type Field = 'min' | 'max';

type Props = {
    field: Field;
    value?: string;
    error: string | null;
    onBlur: (value: { [K in Field]?: string }) => void;
    onEnterKey: (value: { [K in Field]?: string }) => void;
    onChange: (value: string) => void;
    errorClass: string;
};

const PLACEHOLDERS: Record<Field, string> = {
    min: i18n.t('Min'),
    max: i18n.t('Max'),
};

class NumericFilterInputPlain extends Component<Props> {
    getValueObject(value: string) {
        return { [this.props.field]: value.trim() } as { [K in Field]?: string };
    }

    handleBlur = (value: string) => {
        this.props.onBlur(this.getValueObject(value));
    };

    handleKeyDown = (payload: { value?: string }, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.props.onEnterKey(
                this.getValueObject(payload.value ?? this.props.value ?? ''),
            );
        }
    };

    render() {
        const { field, error, errorClass, onBlur, onEnterKey, onChange, ...passOnProps } = this.props;
        return (
            <div>
                <D2TextField
                    onKeyDown={this.handleKeyDown}
                    onBlur={this.handleBlur}
                    onChange={onChange}
                    placeholder={PLACEHOLDERS[field]}
                    {...passOnProps}
                />
                <div className={errorClass}>
                    {error}
                </div>
            </div>
        );
    }
}

export const NumericFilterInput = withInternalChangeHandler()(NumericFilterInputPlain);
