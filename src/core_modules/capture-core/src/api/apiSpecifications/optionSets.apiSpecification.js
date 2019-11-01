// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

export default new ApiSpecification((o) => {
    o.modelName = 'optionSets';
    o.modelGetterType = getterTypes.LIST;
    o.queryParams = {
        fields: 'id,displayName,version,valueType,options[id,displayName,code,style, translations]',
    };
    o.converter = (d2Model) => {
        if (!d2Model) {
            return [];
        }

        return d2Model.map(optionSet => ({
            id: optionSet.id,
            displayName: optionSet.displayName,
            version: optionSet.version,
            valueType: optionSet.valueType,
            translations: optionSet.translations,
            options: optionSet.options && [...optionSet.options.values()].map(option => ({
                id: option.id,
                displayName: option.displayName,
                code: option.code,
                style: option.style,
                translations: option.translations,
            })),
        }));
    };
});
