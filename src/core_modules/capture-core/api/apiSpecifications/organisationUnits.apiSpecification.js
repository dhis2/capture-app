// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

export default new ApiSpecification((o) => {
    o.modelName = 'organisationUnits';
    o.modelGetterType = getterTypes.LIST;
    o.queryParams = {
        fields: 'id,displayName,path,level,code,children[id,displayName,level,children[id]]',
    };
    o.converter = (d2Model) => {
        if (!d2Model) {
            return [];
        }

        return d2Model.map(orgUnit => ({
            id: orgUnit.id,
            displayName: orgUnit.displayName,
            path: orgUnit.path,
            level: orgUnit.level,
            code: orgUnit.code,
        }));
    };
});
