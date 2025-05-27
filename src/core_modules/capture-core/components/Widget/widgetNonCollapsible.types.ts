import type { ReactNode } from 'react';

export type WidgetNonCollapsibleProps = {
    header?: ReactNode;
    children: ReactNode;
    color?: string;
    borderless?: boolean;
};

export type WidgetNonCollapsiblePropsPlain = WidgetNonCollapsibleProps & {
    classes: {
        container: string;
        header: string;
    };
};
