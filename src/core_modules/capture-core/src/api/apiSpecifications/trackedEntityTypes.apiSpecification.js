// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

function converter(d2Model) {
    if (!d2Model || d2Model.length === 0) {
        return null;
    }

    return d2Model.map(item => ({
        id: item.id,
        displayName: item.displayName,
        trackedEntityTypeAttributes: item.trackedEntityTypeAttributes,
    }));
}

export default new ApiSpecification((_this) => {
    _this.modelName = 'trackedEntityTypes';
    _this.modelGetterType = getterTypes.LIST;
    _this.queryParams = {
        fields: 'id,displayName, trackedEntityTypeAttributes[*]',
    };
    _this.converter = converter;
});
