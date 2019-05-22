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
        fromConstraint: item.fromConstraint,
        toConstraint: item.toConstraint,
        access: item.access,
    }));
}

export default function getRelationshipsLoadSpecification(storeName: string = 'relationshipTypes'): LoadSpecification {
    return new LoadSpecification((_this) => {
        _this.converter = converter;
        _this.d2ModelGetterType = getterTypes.LIST;
        _this.d2ModelName = 'relationshipTypes';
        _this.loader = loadStoreDataIfNotExists;
        _this.objectStore = storeName;
        _this.queryParams = {
            fields: 'id,displayName,fromConstraint[*],toConstraint[*],access[*]',
        };
    });
}
