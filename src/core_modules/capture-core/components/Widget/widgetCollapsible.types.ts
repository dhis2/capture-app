import type { ReactNode } from 'react';

export type WidgetCollapsibleProps = {
    header?: ReactNode;
    children: ReactNode;
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    color?: string;
    borderless?: boolean;
};

export type WidgetCollapsiblePropsPlain = WidgetCollapsibleProps & {
    classes: {
        headerContainer: string;
        header: string;
        children: string;
        toggleButton: string;
    };
};
