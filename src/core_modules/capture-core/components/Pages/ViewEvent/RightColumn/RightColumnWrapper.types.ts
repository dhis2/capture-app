import type { ComponentType } from 'react';

export type PlainProps = {
    [key: string]: any;
};

export type ComponentContainer = {
    id: string;
    Component: ComponentType<any>;
};
