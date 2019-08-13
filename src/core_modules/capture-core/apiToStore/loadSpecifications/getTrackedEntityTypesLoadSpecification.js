// @flow
import LoadSpecification from '../LoadSpecificationDefinition/LoadSpecification';
import ApiSpecification from '../../api/ApiSpecificationDefinition/ApiSpecification';
import { loadStoreDataIfNotExists } from '../loader/storeDataLoaders';

export default function getTrackedEntitiesLoadSpecification(
    storeName: string = 'trackedEntityTypes',
    apiSpecification: ApiSpecification): LoadSpecification {
    return new LoadSpecification((o) => {
        o.loader = loadStoreDataIfNotExists;
        o.objectStore = storeName;
    }, apiSpecification);
}
