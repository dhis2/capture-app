// @flow
/**
 * @module rulesEngineActionsCreator
 */
import { RulesEngine } from '../../capture-core-utils/RulesEngine';
import { Program, RenderFoundation, TrackerProgram } from '../metaData';
import runRulesForSingleEvent from './runRulesForSingleEvent';
import runRulesForTEI from './runRulesForTEI';
import postProcessRulesEffects from './postProcessRulesEffects';
import { updateRulesEffects } from './rulesEngine.actions';
import { RulesEngine } from '../../capture-core-utils/RulesEngine';
import type {
    OutputsEffect,
    EventData,
    Enrollment,
    TEIValues,
    EventsData,
    OrgUnit,
} from '../../capture-core-utils/RulesEngine/rulesEngine.types';

import type {
    OutputsEffect,
    Enrollment,
    TEIValues,
    OrgUnit,
    InputEvent,
} from '../../capture-core-utils/RulesEngine/rulesEngine.types';

const rulesEngine = new RulesEngine();

function getRulesActions(
    rulesEffects: ?OutputsEffect,
    foundation: ?RenderFoundation,
    formId: string,
) {
    const effectsHierarchy = postProcessRulesEffects(rulesEffects, foundation);
    return [updateRulesEffects(effectsHierarchy, formId)];
}

export function getRulesActionsForEvent(
    program: ?Program,
    foundation: ?RenderFoundation,
    formId: string,
    orgUnit: OrgUnit,
    currentEvent: ?InputEvent = {},
    allEventsData: ?Array<InputEvent> = [],
) {
    const rulesEffects = runRulesForSingleEvent(
        rulesEngine,
        program,
        foundation,
        orgUnit,
        currentEvent,
        allEventsData,
    );

        return getRulesActions(rulesEffects, foundation, formId);
    }
    return null;
}

export function getRulesActionsForTEI(
    program: ?TrackerProgram,
    foundation: ?RenderFoundation,
    formId: string,
    orgUnit: OrgUnit,
    enrollmentData: ?Enrollment,
    teiValues: ?TEIValues,
) {
    const rulesEffects = runRulesForTEI(
        rulesEngine,
        program,
        foundation,
        orgUnit,
        enrollmentData,
        teiValues,
    );

    return getRulesActions(rulesEffects, foundation, formId);
}
