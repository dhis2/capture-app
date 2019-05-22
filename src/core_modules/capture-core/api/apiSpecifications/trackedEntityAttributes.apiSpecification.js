// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

export default new ApiSpecification((_this) => {
    _this.modelName = 'trackedEntityAttributes';
    _this.modelGetterType = getterTypes.LIST;
    _this.queryParams = {
        fields: ':all,optionSet[id,version],trackedEntity[id,displayName]',
    };
    _this.converter = d2Model => d2Model;
});
