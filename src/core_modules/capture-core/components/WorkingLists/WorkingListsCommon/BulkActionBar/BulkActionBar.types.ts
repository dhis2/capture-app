import type { ReactNode } from 'react';

type SharedProps = {
    onClearSelection: () => void;
    selectedRowsCount: number;
    children: ReactNode;
};

export type ContainerProps = SharedProps;

export type ComponentProps = SharedProps;
