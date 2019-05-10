// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

function getTrackedEntityTypeAttribute(typeAttribute) {
    const { trackedEntityAttribute, ...attribute } = typeAttribute;
    const trackedEntityAttributeId = trackedEntityAttribute && trackedEntityAttribute.id;
    if (!trackedEntityAttributeId) {
        log.error(
            errorCreator(
                'encountered a trackedEntityTypeAttribute without a trackedEntityAttribe id',
            )({ typeAttribute }),
        );
    }

    return {
        ...attribute,
        trackedEntityAttributeId,
    };
}

function getTrackedEntityTypeAttributes(attributes) {
    return attributes ?
        attributes
            .map(ta => getTrackedEntityTypeAttribute(ta))
            .filter(ta => ta) : null;
}

function converter(d2Model) {
    if (!d2Model || d2Model.length === 0) {
        return null;
    }

    return d2Model.map(item => ({
        id: item.id,
        displayName: item.displayName,
        trackedEntityTypeAttributes: getTrackedEntityTypeAttributes(item.trackedEntityTypeAttributes),
        translations: item.translations,
        featureType: item.featureType,
        access: item.access,
        minAttributesRequiredToSearch: item.minAttributesRequiredToSearch,
        maxTeiCountToReturn: item.maxTeiCountToReturn,
        displayDescription: item.displayDescription,
    }));
}

export default new ApiSpecification((_this) => {
    _this.modelName = 'trackedEntityTypes';
    _this.modelGetterType = getterTypes.LIST;
    _this.queryParams = {
        fields: '*, trackedEntityTypeAttributes[*]',
    };
    _this.converter = converter;
});
