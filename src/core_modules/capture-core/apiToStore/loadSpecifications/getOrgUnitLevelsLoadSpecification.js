// @flow
import LoadSpecification from '../LoadSpecificationDefinition/LoadSpecification';
import getterTypes from '../../api/fetcher/getterTypes.const';
import { loadStoreDataIfNotExists } from '../loader/storeDataLoaders';

function converter(d2Model) {
    if (!d2Model || d2Model.length === 0) {
        return null;
    }

    return d2Model.map(item => ({
        id: item.id,
        displayName: item.displayName,
        level: item.level,
    }));
}

export default function getOrgUnitLevelsLoadSpecification(storeName: string = 'ouLevels'): LoadSpecification {
    return new LoadSpecification((_this) => {
        _this.converter = converter;
        _this.d2ModelGetterType = getterTypes.LIST;
        _this.d2ModelName = 'organisationUnitLevels';
        _this.loader = loadStoreDataIfNotExists;
        _this.objectStore = storeName;
        _this.queryParams = {
            fields: 'id,displayName,level',
            filter: 'level:gt:1',
        };
    });
}
