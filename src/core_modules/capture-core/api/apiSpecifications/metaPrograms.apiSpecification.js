// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

export default new ApiSpecification((o) => {
    o.modelName = 'programs';
    o.modelGetterType = getterTypes.LIST;
    o.queryParams = {
        restrictToCaptureScope: true,
        fields: 'id,version,programTrackedEntityAttributes[trackedEntityAttribute[id,optionSet[id,version]]],programStages[id,programStageDataElements[dataElement[id,optionSet[id,version]]]]',
    };
    o.converter = d2Model => d2Model;
});
