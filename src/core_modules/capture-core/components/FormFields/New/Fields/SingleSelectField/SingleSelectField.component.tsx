import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SimpleSingleSelect } from '@dhis2/ui';
import { withFocusHandler } from './withFocusHandler';
import { withSelectSingleTranslations } from './withTranslations';

type Option = {
    value: any;
    label: string;
};

const WINDOWING_THRESHOLD = 200;
const WINDOW_PAGE_SIZE = 100;

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
    const [filterValue, setFilterValue] = useState('');
    const [visibleCount, setVisibleCount] = useState(WINDOW_PAGE_SIZE);

    const filteredOptions = useMemo(
        () => (filterable && filterValue
            ? options.filter(({ label }) => label.toLowerCase().includes(filterValue.toLowerCase()))
            : options),
        [options, filterValue, filterable],
    );

    const useWindowing = filteredOptions.length > WINDOWING_THRESHOLD;

    const visibleOptions = useMemo(
        () => (useWindowing ? filteredOptions.slice(0, visibleCount) : filteredOptions),
        [filteredOptions, useWindowing, visibleCount],
    );

    const selectedOption = value == null
        ? undefined
        : options.find(option => option.value === value) ?? { value, label: String(value) };

    const handleFilterChange = useCallback((newFilterValue: string) => {
        setFilterValue(newFilterValue);
        setVisibleCount(WINDOW_PAGE_SIZE);
    }, []);

    const handleEndReached = useCallback(() => {
        setVisibleCount(current => Math.min(current + WINDOW_PAGE_SIZE, filteredOptions.length));
    }, [filteredOptions.length]);

    const handleChange = (nextValue: string | { value: string }) => {
        const resolvedValue = typeof nextValue === 'string' ? nextValue : nextValue?.value;
        if (onChange) {
            onChange(resolvedValue ?? null);
        }
        setFilterValue('');
        onBlur?.(resolvedValue ?? null);
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
                options={visibleOptions}
                selected={selectedOption}
                placeholder={placeholder}
                clearable={clearable}
                filterable={filterable}
                filterValue={filterValue}
                onFilterChange={handleFilterChange}
                onEndReached={handleEndReached}
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
