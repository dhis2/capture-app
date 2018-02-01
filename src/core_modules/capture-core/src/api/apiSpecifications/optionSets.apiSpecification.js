// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

export default new ApiSpecification((_this) => {
    _this.modelName = 'optionSets';
    _this.modelGetterType = getterTypes.LIST;
    _this.queryParams = {
        fields: 'id,displayName,version,valueType,options[id,displayName,code]',
    };
    _this.converter = (d2Model) => {
        if (!d2Model) {
            return [];
        }

        return d2Model.map(optionSet => ({
            id: optionSet.id,
            displayName: optionSet.displayName,
            version: optionSet.version,
            valueType: optionSet.valueType,
            options: optionSet.options && [...optionSet.options.values()].map(option => ({
                id: option.id,
                displayName: option.displayName,
                code: option.code,
            })),
        }));
    };
});
