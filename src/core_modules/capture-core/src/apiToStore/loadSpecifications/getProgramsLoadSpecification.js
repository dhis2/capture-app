// @flow
import LoadSpecification from '../LoadSpecificationDefinition/LoadSpecification';
import { loadStoreData } from '../loader/storeDataLoaders';
import ApiSpecification from '../../api/ApiSpecificationDefinition/ApiSpecification';

export default function getProgramsLoadSpecification(
    storeName: string = 'programs',
    apiSpecification: ApiSpecification): LoadSpecification {
    return new LoadSpecification((o) => {
        o.loader = loadStoreData;
        o.objectStore = storeName;
    }, apiSpecification);
}
