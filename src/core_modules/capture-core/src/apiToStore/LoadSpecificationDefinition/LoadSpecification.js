// @flow
/* eslint-disable no-unused-expressions */
import ApiSpecification from '../../api/ApiSpecificationDefinition/ApiSpecification';
import StorageContainer from '../../storage/StorageContainer';
import getterTypes from '../../api/fetcher/getterTypes.const';
import type { Converter } from '../../api/fetcher/apiFetchers';

type Loader = (
storageContainer: StorageContainer,
objectStore: string,
queryParams: ?Object,
d2ModelName: string,
d2ModelGetterType: $Values<typeof getterTypes>,
converter: Converter) => Promise<void>;

class LoadSpecification {
    objectStore: string;
    loader: Loader;
    d2ModelName: string;
    d2ModelGetterType: $Values<typeof getterTypes>;
    queryParams: ?Object;
    converter: Converter;

    constructor(initFn: (_this: LoadSpecification) => void, apiSpecification?: ApiSpecification) {
        initFn && initFn(this);
        if (apiSpecification) {
            this.d2ModelName = apiSpecification.modelName;
            this.d2ModelGetterType = apiSpecification.modelGetterType;
            this.queryParams = apiSpecification.queryParams;
            this.converter = apiSpecification.converter;
        }
    }

    load(storageContainer: StorageContainer) {
        return this.loader(
            storageContainer,
            this.objectStore,
            this.queryParams,
            this.d2ModelName,
            this.d2ModelGetterType,
            this.converter,
        );
    }
}

export default LoadSpecification;
