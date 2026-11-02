import React, { type ComponentType, useEffect } from 'react';

type Props = {
    value?: string | null;
    options?: Array<{ value: string }>;
    onChange?: (value: string | null) => void;
    onBlur?: (value: string | null) => void;
};

// The category options are filtered by org unit, so a selected option is cleared when it is no longer available
export const withClearUnavailableCategoryOption = () => (InnerComponent: ComponentType<any>) =>
    (props: Props) => {
        const { value, options, onChange, onBlur } = props;
        const isUnavailable = !!value && !options?.some(option => option.value === value);

        useEffect(() => {
            if (isUnavailable) {
                onChange?.(null);
                onBlur?.(null);
            }
        }, [isUnavailable, onChange, onBlur]);

        return <InnerComponent {...props} />;
    };
