// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

export default new ApiSpecification((_this) => {
    _this.modelName = 'programs';
    _this.modelGetterType = getterTypes.LIST;
    _this.queryParams = {
        // filter: 'programType:eq:WITH_REGISTRATION',
        fields: 'id,version,programTrackedEntityAttributes[trackedEntityAttribute[id,optionSet[id,version]]],programStages[id,programStageDataElements[dataElement[id,optionSet[id,version]]]]',
    };
    _this.converter = d2Model => d2Model;
});
