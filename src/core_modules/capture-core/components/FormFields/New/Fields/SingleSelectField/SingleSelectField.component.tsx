import React, { useEffect, useRef } from 'react';
import { SimpleSingleSelect } from '@dhis2/ui';
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

const NewSingleSelectFieldComponentPlain = ({
    id,
    value,
    onChange,
    onBlur,
    onFocus,
    options,
    disabled,
    required,
    placeholder,
    filterable = false,
    clearable = true,
    dataTest,
}: Props) => {
    const selectRef = useRef<HTMLDivElement | null>(null);
    const fieldName = id ?? 'single-select-field';

    const selectedOption = value == null
        ? undefined
        : options.find(option => option.value === value) ?? { value, label: String(value) };

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

    useEffect(() => {
        const element = selectRef.current;
        if (!element) {
            return undefined;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Backspace' && value != null) {
                onChange?.(null);
                onBlur?.(null);
            }
        };

        element.addEventListener('keydown', handleKeyDown);

        return () => {
            element.removeEventListener('keydown', handleKeyDown);
        };
    }, [onBlur, onChange, value]);

    return (
        <div ref={selectRef}>
            <SimpleSingleSelect
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
        </div>
    );
};

export const SingleSelectField = withFocusHandler()(withSelectSingleTranslations()(NewSingleSelectFieldComponentPlain));
