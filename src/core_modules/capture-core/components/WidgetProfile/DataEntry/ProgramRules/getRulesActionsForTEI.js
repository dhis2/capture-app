// @flow
import type {
    Enrollment,
    TEIValues,
    OutputEffects,
    OrgUnit,
    TrackedEntityAttributes,
    OptionSets,
    ProgramRulesContainer,
} from 'capture-core-utils/rulesEngine';
import { rulesEngine } from '../../../../rules/rulesEngine';
import type { RenderFoundation } from '../../../../metaData';
import { postProcessRulesEffects } from '../../../../rules/actionsCreator/postProcessRulesEffects';
import { updateRulesEffects } from '../../../../rules/actionsCreator/rulesEngine.actions';

const getRulesActions = (rulesEffects: ?OutputEffects, foundation: ?RenderFoundation, formId: string) => {
    const effectsHierarchy = postProcessRulesEffects(rulesEffects, foundation);
    return [updateRulesEffects(effectsHierarchy, formId)];
};

export const getRulesActionsForTEI = ({
    foundation,
    formId,
    orgUnit,
    enrollmentData,
    teiValues,
    trackedEntityAttributes,
    optionSets,
    rulesContainer,
}: {
    foundation: ?RenderFoundation,
    formId: string,
    orgUnit: OrgUnit,
    enrollmentData?: ?Enrollment,
    teiValues?: ?TEIValues,
    trackedEntityAttributes: ?TrackedEntityAttributes,
    optionSets: OptionSets,
    rulesContainer: ProgramRulesContainer,
}) => {
    const effects = rulesEngine.getProgramRuleEffects({
        programRulesContainer: rulesContainer,
        currentEvent: null,
        eventsContainer: null,
        dataElements: null,
        selectedEntity: teiValues,
        trackedEntityAttributes,
        selectedEnrollment: enrollmentData,
        selectedOrgUnit: orgUnit,
        optionSets,
    });
    const rulesEffects = effects.length > 0 ? effects : null;
    return getRulesActions(rulesEffects, foundation, formId);
};
