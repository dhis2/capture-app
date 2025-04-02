import type { ReactElement } from 'react';

export type QuickActionButtonTypes = {
    icon: ReactElement;
    label: string;
    onClickAction: () => void;
    dataTest?: string;
    disable?: boolean;
};
