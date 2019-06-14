// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

export default new ApiSpecification((o) => {
    o.modelName = 'trackedEntityAttributes';
    o.modelGetterType = getterTypes.LIST;
    o.queryParams = {
        fields: ':all,optionSet[id,version],trackedEntity[id,displayName]',
    };
    o.converter = d2Model => d2Model;
});
