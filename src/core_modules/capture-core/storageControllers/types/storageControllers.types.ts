import { availableAdapters } from 'capture-core-utils/storage/availableAdapters';

export type ServerVersion = {
    minor: number;
    patch?: number | null;
    tag?: string | null;
};

export type AdapterTypes = Array<keyof typeof availableAdapters>;
