// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

export default (orgUnitId: string) => new ApiSpecification((_this) => {
    _this.modelName = 'organisationUnits';
    _this.modelGetterType = getterTypes.GET;
    _this.queryParams = {
        id: orgUnitId,
        fields: 'id,displayName',
    };
    _this.converter = d2Model => ({
        id: d2Model.id,
        name: d2Model.displayName,
    });
});
