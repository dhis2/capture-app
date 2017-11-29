// @flow
import LoadSpecification from 'd2-tracker/metaData/loadSpecifications/LoadSpecification';
import { loadStoreDataIfNotExists } from 'd2-tracker/metaData/loader/storeDataLoaders';
import getterTypes from 'd2-tracker/metaData/loader/getterTypes.const';

function converter(d2Model) {
    if (!d2Model || d2Model.length === 0) {
        return null;
    }

    return d2Model.map(item => ({
        
    }));
}

export default function getSystemSettings(storeName: string = 'SYSTEM_SETTINGS'): LoadSpecification {
    return new LoadSpecification((_this) => {
        _this.converter = converter;
        _this.d2ModelGetterType = getterTypes.LIST;
        _this.d2ModelName = 'systemSettings';
        _this.loader = loadStoreDataIfNotExists;
        _this.objectStore = storeName;
        _this.queryParams = {
            
        };
    });
}
