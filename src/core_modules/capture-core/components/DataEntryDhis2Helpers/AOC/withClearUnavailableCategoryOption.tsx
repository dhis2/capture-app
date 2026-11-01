import React, { type ComponentType, useEffect } from 'react';

type Props = {
    value?: string | null;
    options?: Array<{ value: string }>;
    disabled?: boolean;
    onChange?: (value: string | null) => void;
    onBlur?: (value: string | null) => void;
};

// Category options depend on the org unit, so clear the value when it is not available or no org unit is selected
export const withClearUnavailableCategoryOption = () => (InnerComponent: ComponentType<any>) =>
    (props: Props) => {
        const { value, options, disabled, onChange, onBlur } = props;
        const isUnavailable = !!value && (disabled || !options?.some(option => option.value === value));

        useEffect(() => {
            if (isUnavailable) {
                onChange?.(null);
                onBlur?.(null);
            }
        }, [isUnavailable, onChange, onBlur]);

        return <InnerComponent {...props} />;
    };
