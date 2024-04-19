// @flow
import { useMemo } from 'react';
import { TARGET_SIDES } from '../common';
import type { ApplicableTypesInfo } from './linkedEntityMetadataSelector.types';
import type { RelationshipType } from '../../../common/Types';
import { RELATIONSHIP_ENTITIES } from '../../../common/constants';
import type { TargetSides } from '../../../common/LinkedEntityMetadataSelector';

const isApplicableProgram = (programId, sourceProgramIds) =>
    (!sourceProgramIds || !programId || sourceProgramIds.includes(programId));

const isApplicableUnidirectionalRelationshipType = (
    { trackedEntityType, program },
    sourceTrackedEntityTypeId,
    sourceProgramIds,
) => {
    const trackedEntityTypeId = trackedEntityType.id;
    const programId = program?.id;

    return Boolean(
        sourceTrackedEntityTypeId === trackedEntityTypeId &&
        isApplicableProgram(programId, sourceProgramIds),
    );
};

const computeTargetSidesDualMatchingTET = (() => {
    const getProgramMatchInfo = (sourceProgramIds, programId) => {
        if (!programId) {
            return { noProgram: true, programMatch: false };
        }

        if (sourceProgramIds.includes(programId)) {
            return { programMatch: true, noProgram: false };
        }

        return { programMatch: false, noProgram: false };
    };

    return (sourceProgramIds, fromProgramId, toProgramId): Array<TargetSides> => {
        if (!sourceProgramIds) {
            return [TARGET_SIDES.FROM, TARGET_SIDES.TO];
        }
        const { programMatch: fromProgramMatch, noProgram: fromNoProgram } =
            getProgramMatchInfo(sourceProgramIds, fromProgramId);
        const { programMatch: toProgramMatch, noProgram: toNoProgram } =
            getProgramMatchInfo(sourceProgramIds, toProgramId);

        if (fromProgramMatch) {
            return [TARGET_SIDES.TO];
        } else if (toProgramMatch) {
            return [TARGET_SIDES.FROM];
        } else if (fromNoProgram && toNoProgram) {
            return [TARGET_SIDES.FROM, TARGET_SIDES.TO];
        } else if (fromNoProgram) {
            return [TARGET_SIDES.TO];
        } else if (toNoProgram) {
            return [TARGET_SIDES.FROM];
        }

        return [];
    };
})();

const getApplicableTargetSidesForBidirectionalRelationshipType = ({
    fromConstraint,
    toConstraint,
}, sourceTrackedEntityTypeId, sourceProgramIds): Array<TargetSides> => {
    const { trackedEntityType: fromTrackedEntityType } = fromConstraint;
    const { trackedEntityType: toTrackedEntityType } = toConstraint;

    if (fromTrackedEntityType.id === sourceTrackedEntityTypeId &&
        toTrackedEntityType.id === sourceTrackedEntityTypeId) {
        return computeTargetSidesDualMatchingTET(
            sourceProgramIds,
            fromConstraint.program?.id,
            toConstraint.program?.id,
        );
    }

    if (fromTrackedEntityType.id === sourceTrackedEntityTypeId ||
        toTrackedEntityType.id === sourceTrackedEntityTypeId) {
        const { programId, targetSide } = fromTrackedEntityType.id === sourceTrackedEntityTypeId ?
            { programId: fromConstraint.program?.id, targetSide: TARGET_SIDES.TO } :
            { programId: toConstraint.program?.id, targetSide: TARGET_SIDES.FROM };
        return isApplicableProgram(programId, sourceProgramIds) ? [targetSide] : [];
    }

    return [];
};

export const useApplicableTypesAndSides = (
    relationshipTypes: $ReadOnlyArray<RelationshipType>,
    sourceTrackedEntityTypeId: string,
    sourceProgramIds: $ReadOnlyArray<string>,
): ApplicableTypesInfo => useMemo(() =>
    relationshipTypes
        .filter(({ access }) => access.data.write)
        .map(({
            fromConstraint,
            toConstraint,
            bidirectional,
            id,
            displayName,
            fromToName,
            toFromName,
        }) => {
            if (fromConstraint.relationshipEntity === RELATIONSHIP_ENTITIES.TRACKED_ENTITY_INSTANCE &&
                toConstraint.relationshipEntity === RELATIONSHIP_ENTITIES.TRACKED_ENTITY_INSTANCE) {
                if (!bidirectional) {
                    const applicable = isApplicableUnidirectionalRelationshipType(
                        fromConstraint,
                        sourceTrackedEntityTypeId,
                        sourceProgramIds,
                    );

                    if (!applicable) {
                    // $FlowFixMe filter
                        return null;
                    }
                    const { trackedEntityType, program } = toConstraint;

                    return {
                        id,
                        name: displayName,
                        sides: [{
                            programId: program?.id,
                            trackedEntityTypeId: trackedEntityType.id,
                            trackedEntityName: trackedEntityType.name.toLowerCase(),
                            targetSide: TARGET_SIDES.TO,
                            name: fromToName ?? displayName,
                        }],
                    };
                }

                const targetSides = getApplicableTargetSidesForBidirectionalRelationshipType(
                    { fromConstraint, toConstraint },
                    sourceTrackedEntityTypeId,
                    sourceProgramIds,
                );

                if (!targetSides.length) {
                // $FlowFixMe filter
                    return null;
                }

                return {
                    id,
                    name: displayName,
                    sides: targetSides.map((targetSide) => {
                        const {
                            trackedEntityTypeId,
                            trackedEntityName,
                            programId,
                            name,
                        } = targetSide === TARGET_SIDES.TO ? {
                            trackedEntityTypeId: toConstraint.trackedEntityType.id,
                            trackedEntityName: toConstraint.trackedEntityType.name.toLowerCase(),
                            programId: toConstraint.program?.id,
                            name: fromToName,
                        } : {
                            trackedEntityTypeId: fromConstraint.trackedEntityType.id,
                            trackedEntityName: fromConstraint.trackedEntityType.name.toLowerCase(),
                            programId: fromConstraint.program?.id,
                            name: toFromName,
                        };

                        return {
                            trackedEntityTypeId,
                            trackedEntityName,
                            programId,
                            targetSide,
                            // $FlowFixMe
                            name,
                        };
                    }),
                };
            }
            // $FlowFixMe filter
            return null;
        }).filter(applicableType => applicableType),
[relationshipTypes, sourceTrackedEntityTypeId, sourceProgramIds]);
