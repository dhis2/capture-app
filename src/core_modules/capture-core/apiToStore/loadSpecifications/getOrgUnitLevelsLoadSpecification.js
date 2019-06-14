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
    return new LoadSpecification((o) => {
        o.converter = converter;
        o.d2ModelGetterType = getterTypes.LIST;
        o.d2ModelName = 'organisationUnitLevels';
        o.loader = loadStoreDataIfNotExists;
        o.objectStore = storeName;
        o.queryParams = {
            fields: 'id,displayName,level',
            filter: 'level:gt:1',
        };
    });
}
