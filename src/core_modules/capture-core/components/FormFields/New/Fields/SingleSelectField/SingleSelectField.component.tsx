import React from 'react';
import { SimpleSingleSelect } from '@dhis2-ui/select';
import { withFocusHandler } from './withFocusHandler';
import { withSelectSingleTranslations } from './withTranslations';

type Option = {
    value: any;
    label: string;
};

type Props = {
    id?: string;
    value?: string | null;
    onChange?: (value: string | null) => void;
    onBlur?: (value: string | null) => void;
    onFocus?: (value: string | null) => void;
    options: Option[];
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
    filterable?: boolean;
    clearable?: boolean;
    dataTest?: string;
};

const SimpleSelect = SimpleSingleSelect as React.ComponentType<Record<string, any>>;

const SingleSelectFieldComponentPlain = ({
    id,
    value,
    onChange,
    onBlur,
    onFocus,
    options,
    disabled,
    required,
    placeholder,
    filterable = true,
    clearable = true,
    dataTest,
}: Props) => {
    const fieldName = id ?? 'single-select-field';

    const selectedOption = value != null
        ? options.find(option => option.value === value) ?? { value, label: String(value) }
        : null;

    const handleChange = (nextValue: string | { value: string }) => {
        const resolvedValue = typeof nextValue === 'string' ? nextValue : nextValue?.value;
        if (onChange) {
            onChange(resolvedValue ?? null);
        } else {
            onBlur?.(resolvedValue ?? null);
        }
    };

    const handleBlur = () => {
        onBlur?.(value ?? null);
    };

    const handleFocus = () => {
        onFocus?.(value ?? null);
    };

    const handleClear = () => {
        onChange?.(null);
        onBlur?.(null);
    };

    return (
        <SimpleSelect
            name={fieldName}
            options={options}
            selected={selectedOption}
            placeholder={placeholder}
            clearable={clearable}
            filterable={filterable}
            aria-required={required}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onClear={handleClear}
            dataTest={dataTest}
            disabled={disabled}
        />
    );
};

export const SingleSelectField = withFocusHandler()(withSelectSingleTranslations()(SingleSelectFieldComponentPlain));

