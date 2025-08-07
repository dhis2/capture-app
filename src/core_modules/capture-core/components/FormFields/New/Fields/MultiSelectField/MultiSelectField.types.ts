import type { ReactNode } from 'react';

type MultiSelectOptionConfig = {
    label: string,
    value: any,
    id: string,
    icon?: ReactNode | null,
};

export type Props = {
    onSelect: (value: string | null) => void,
    onFocus: () => void,
    onBlur: (value: string | null) => void,
    options: Array<MultiSelectOptionConfig>,
    value?: string,
    disabled: boolean,
    translations: {
        filterPlaceholder: string,
        noMatchText: string,
    },
};
