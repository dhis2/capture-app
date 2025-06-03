import type { ReactNode } from 'react';

type CssClasses = {
    classes: Record<string, string>;
};

export type Props = {
    sectionName: string;
    children: ReactNode;
    dataTest?: string;
} & CssClasses;
