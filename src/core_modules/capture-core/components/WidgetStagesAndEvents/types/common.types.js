// @flow
import type { Icon } from 'capture-core/metaData';
import type { apiDataElement } from 'capture-core/metaDataStoreLoaders/programs/quickStoreOperations/types';


export type Stage = {
    id: string,
    name: string,
    description: string,
    icon?: Icon,
    dataElements: Array<apiDataElement>
}
