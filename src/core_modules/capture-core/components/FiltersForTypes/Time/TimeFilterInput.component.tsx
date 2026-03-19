import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { InputField } from '@dhis2/ui';
import type { InputEventPayload } from '@dhis2-ui/input';

type Field = 'from' | 'to';

type ValueObject = { [K in Field]?: string | null };

type Props = {
    field: Field;
    value?: string | null;
    onBlur: (value: ValueObject) => void;
    onEnterKey: (value: ValueObject) => void;
    onChange: (value: string) => void;
    placeholder?: string;
};

const PLACEHOLDERS: Record<Field, string> = {
    from: i18n.t('Time'),
    to: i18n.t('Time'),
};

function getTrimmedValue(value: string): string {
    return (value ?? '').trim();
}

class TimeFilterInputPlain extends Component<Props> {
    getValueObject(value: string): ValueObject {
        const trimmed = getTrimmedValue(value);
        return { [this.props.field]: trimmed || null } as ValueObject;
    }

    handleBlur = (payload: InputEventPayload) => {
        const value = getTrimmedValue(payload.value ?? '');
        this.props.onBlur(this.getValueObject(value));
    };

    handleKeyDown = (payload: InputEventPayload, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const value = getTrimmedValue(payload.value ?? this.props.value ?? '');
            this.props.onEnterKey(this.getValueObject(value));
        }
    };

    handleChange = (payload: InputEventPayload) => {
        const value = getTrimmedValue(payload.value ?? '');
        this.props.onChange(value);
    };

    render() {
        const { field, value, placeholder } = this.props;
        return (
            <InputField
                type="time"
                value={value ?? ''}
                placeholder={placeholder ?? PLACEHOLDERS[field]}
                onBlur={this.handleBlur}
                onKeyDown={this.handleKeyDown}
                onChange={this.handleChange}
            />
        );
    }
}

export const TimeFilterInput = TimeFilterInputPlain;
