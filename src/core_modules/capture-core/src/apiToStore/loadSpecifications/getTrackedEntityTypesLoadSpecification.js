// @flow
import LoadSpecification from '../LoadSpecificationDefinition/LoadSpecification';
import ApiSpecification from '../../api/ApiSpecificationDefinition/ApiSpecification';
import { loadStoreDataIfNotExists } from '../loader/storeDataLoaders';

export default function getTrackedEntitiesLoadSpecification(
    storeName: string = 'trackedEntityTypes',
    apiSpecification: ApiSpecification): LoadSpecification {
    return new LoadSpecification((_this) => {
        _this.loader = loadStoreDataIfNotExists;
        _this.objectStore = storeName;
    }, apiSpecification);
}
