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
    _this.converter = (d2ProgramIndicators: ?Array<Object>) => {
        if (!d2ProgramIndicators || d2ProgramIndicators.length === 0) {
            return null;
        }

        const programIndicators = d2ProgramIndicators.map(d2ProgramIndicator => ({
            id: d2ProgramIndicator.id,
            displayName: d2ProgramIndicator.displayName,
            code: d2ProgramIndicator.code,
            shortName: d2ProgramIndicator.shortName,
            displayInForm: d2ProgramIndicator.displayInForm,
            expression: d2ProgramIndicator.expression,
            displayDescription: d2ProgramIndicator.displayDescription,
            description: d2ProgramIndicator.description,
            filter: d2ProgramIndicator.filter,
            programId: d2ProgramIndicator.program && d2ProgramIndicator.program.id,
        }));

        return programIndicators;
    };
});
