import log from 'loglevel';
import { errorCreator, pipe } from 'capture-core-utils';
import { generateUID } from '../../../../utils/uid/generateUID';
import { relatedStageActions } from '../../../WidgetRelatedStages';
import type { LinkedRequestEvent, ConvertedRelatedStageEventProps } from './getConvertedRelatedStageEvent.types';
import { convertClientToServer, convertFormToClient } from '../../../../converters';
import { dataElementTypes } from '../../../../metaData';

const convertFn = pipe(convertFormToClient, convertClientToServer);

const getEventDetailsByLinkMode = ({
    relatedStageDataValues,
    requestEventIsFromConstraint,
    linkMode,
    relatedStageType,
    programId,
    teiId,
    enrollmentId,
    serverRequestEvent,
}: any): {
    linkedEvent: LinkedRequestEvent | null;
    linkedEventId: string | null;
} => {
    const baseEventDetails = {
        event: generateUID(),
        program: programId,
        programStage: requestEventIsFromConstraint ?
            relatedStageType.toConstraint.programStage.id
            : relatedStageType.fromConstraint.programStage.id,
        trackedEntity: teiId,
        enrollment: enrollmentId,
        dataValues: [],
        notes: [],
        status: 'SCHEDULE' as const,
    };

    if (linkMode === relatedStageActions.SCHEDULE_IN_ORG) {
        const { scheduledAt: linkedEventScheduledAt, orgUnit: linkedEventOrgUnit } = relatedStageDataValues;
        if (!linkedEventScheduledAt || !linkedEventOrgUnit) {
            // Business logic dictates that these values will not be null here
            throw new Error(
                errorCreator('Missing required data for creating related stage event')({
                    linkedEventOrgUnit,
                    linkedEventScheduledAt,
                }),
            );
        }
        return ({
            linkedEvent: {
                ...baseEventDetails,
                scheduledAt: convertFn(linkedEventScheduledAt, dataElementTypes.DATE),
                orgUnit: convertFn(linkedEventOrgUnit, dataElementTypes.ORGANISATION_UNIT),
            },
            linkedEventId: baseEventDetails.event,
        });
    }

    if (linkMode === relatedStageActions.ENTER_DATA) {
        const { orgUnit: linkedEventOrgUnit } = relatedStageDataValues;
        if (!linkedEventOrgUnit) {
            throw new Error(
                errorCreator('Missing required data for creating related stage event')({
                    linkedEventOrgUnit,
                }),
            );
        }

        return ({
            linkedEvent: {
                ...baseEventDetails,
                scheduledAt: serverRequestEvent.occurredAt,
                orgUnit: convertFn(linkedEventOrgUnit, dataElementTypes.ORGANISATION_UNIT),
            },
            linkedEventId: baseEventDetails.event,
        });
    }

    if (linkMode === relatedStageActions.LINK_EXISTING_RESPONSE) {
        const { linkedEventId } = relatedStageDataValues;
        return {
            linkedEvent: null,
            linkedEventId,
        };
    }
    log.error(errorCreator(`Referral mode ${linkMode} is not supported`)());
    return {
        linkedEvent: null,
        linkedEventId: null,
    };
};

export const getConvertedRelatedStageEvent = ({
    linkMode,
    relatedStageDataValues,
    programId,
    teiId,
    currentProgramStageId,
    serverRequestEvent,
    enrollmentId,
    relatedStageType,
}: ConvertedRelatedStageEventProps) => {
    const requestEventIsFromConstraint = relatedStageType.fromConstraint.programStage.id === currentProgramStageId;

    const { linkedEvent, linkedEventId } = getEventDetailsByLinkMode({
        relatedStageDataValues,
        requestEventIsFromConstraint,
        linkMode,
        relatedStageType,
        programId,
        teiId,
        enrollmentId,
        serverRequestEvent,
    });

    const relationship = linkedEventId ? {
        relationshipType: relatedStageType.id,
        relationship: generateUID(),
        from: {
            event: {
                event: requestEventIsFromConstraint ? serverRequestEvent.event : linkedEventId,
            },
        },
        to: {
            event: {
                event: requestEventIsFromConstraint ? linkedEventId : serverRequestEvent.event,
            },
        },
    } : null;

    return {
        linkedEvent,
        relationship,
    };
};
