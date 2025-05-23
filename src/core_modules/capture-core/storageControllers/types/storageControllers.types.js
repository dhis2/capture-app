// @flow
import { availableAdapters } from 'capture-core-utils/storage/availableAdapters';

export type ServerVersion = {
    minor: number,
    patch?: ?number,
    tag?: ?string,
};

export type AdapterTypes = Array<$Keys<typeof availableAdapters>>;
