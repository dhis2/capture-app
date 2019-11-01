// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

export default (orgUnitId: string) => new ApiSpecification((o) => {
    o.modelName = 'organisationUnits';
    o.modelGetterType = getterTypes.GET;
    o.queryParams = {
        id: orgUnitId,
        fields: 'id,displayName',
    };
    o.converter = d2Model => ({
        id: d2Model.id,
        name: d2Model.displayName,
    });
});
