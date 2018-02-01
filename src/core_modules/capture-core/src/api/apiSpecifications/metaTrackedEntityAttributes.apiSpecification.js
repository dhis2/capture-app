// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

export default new ApiSpecification((_this) => {
    _this.modelName = 'trackedEntityAttributes';
    _this.modelGetterType = getterTypes.LIST;
    _this.queryParams = {
        fields: 'id,optionSet[id,version]',
        filter: 'displayInListNoProgram:eq:true',
    };
    _this.converter = (d2Model) => {
        if (!d2Model) {
            return [];
        }

        return d2Model.map(item => ({
            id: item.id,
            optionSet: item.optionSet,
        }));
    };
});
