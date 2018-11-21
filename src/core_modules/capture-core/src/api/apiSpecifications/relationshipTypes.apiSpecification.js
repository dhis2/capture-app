// @flow
import ApiSpecification from '../ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../fetcher/getterTypes.const';

export default new ApiSpecification((_this) => {
    _this.modelName = 'relationshipTypes';
    _this.modelGetterType = getterTypes.LIST;
    _this.queryParams = {
        fields: 'id,displayName,access[*],fromConstraint[*],toConstraint[*]',
    };
    _this.converter = (d2Model) => {
        if (!d2Model) {
            return [];
        }

        return d2Model.map(relationshipType => ({
            id: relationshipType.id,
            displayName: relationshipType.displayName,
            fromConstraint: rela
            path: orgUnit.path,
            level: orgUnit.level,
            code: orgUnit.code,
        }));
    };
});
