// @flow
/**
 * @module rulesEngineActionsCreator
 */

import type {
    OutputEffects,
    Enrollment,
    TEIValues,
    OrgUnit,
    EventData,
    EventsData,
} from 'capture-core-utils/rulesEngine';
import type { Program, RenderFoundation, TrackerProgram, ProgramStage } from '../../metaData';
import { runRulesForSingleEvent } from './runRulesForSingleEvent';
import { runRulesForTEI } from './runRulesForTEI';
import { runRulesForEnrollmentEvent } from './runRulesForEnrollmentEvent';
import { postProcessRulesEffects } from './postProcessRulesEffects';
import { updateRulesEffects } from './rulesEngine.actions';

function getRulesActions(
    rulesEffects: ?OutputEffects,
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
    currentEvent: EventData = {},
    allEventsData: EventsData = [],
    stage: ?ProgramStage,
) {
    const rulesEffects = runRulesForSingleEvent(
        program,
        foundation,
        orgUnit,
        currentEvent,
        allEventsData,
        stage,
    );
    return getRulesActions(rulesEffects, foundation, formId);
}

export const getRulesActionsForEnrollmentEvent = ({
    program,
    foundation,
    formId,
    orgUnit,
    currentEvent,
    eventsData,
    attributeValues,
    enrollmentData,
}: {
    program: TrackerProgram,
    foundation: RenderFoundation,
    formId: string,
    orgUnit: OrgUnit,
    currentEvent: EventData,
    eventsData: EventsData,
    attributeValues: TEIValues,
    enrollmentData: Enrollment,
}) => {
    const rulesEffects = runRulesForEnrollmentEvent({
        program,
        foundation,
        orgUnit,
        currentEvent,
        eventsData,
        attributeValues,
        enrollmentData,
    });
    return getRulesActions(rulesEffects, foundation, formId);
};

export function getRulesActionsForTEI(
    program: ?TrackerProgram,
    foundation: ?RenderFoundation,
    formId: string,
    orgUnit: OrgUnit,
    enrollmentData: ?Enrollment,
    teiValues: ?TEIValues,
) {
    const rulesEffects = runRulesForTEI(
        program,
        foundation,
        orgUnit,
        enrollmentData,
        teiValues,
    );
    return getRulesActions(rulesEffects, foundation, formId);
}
