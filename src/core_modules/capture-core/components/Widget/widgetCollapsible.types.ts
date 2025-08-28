import type { ReactNode } from 'react';

export type WidgetCollapsiblePropsPlain = {
    header?: ReactNode;
    children: ReactNode;
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    color?: string;
    borderless?: boolean;
};
