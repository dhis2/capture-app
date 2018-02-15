// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

export default new ApiSpecification((_this) => {
    _this.modelName = 'programIndicators';
    _this.modelGetterType = getterTypes.LIST;
    _this.queryParams = {
        fields: 'id,displayName,code,shortName,displayInForm,expression,displayDescription,description,filter,program[id]',
        filter: 'program.id:in',
    };
    _this.converter = d2Model => {
        var x = "gege";
    };
});
