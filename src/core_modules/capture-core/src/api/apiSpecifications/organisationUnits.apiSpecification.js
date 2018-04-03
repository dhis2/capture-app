// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

export default new ApiSpecification((_this) => {
    _this.modelName = 'organisationUnits';
    _this.modelGetterType = getterTypes.LIST;
    _this.queryParams = {
        fields: 'id,displayName,path,level,code,children[id,displayName,level,children[id]]',
    };
    _this.converter = (d2Model) => {
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
