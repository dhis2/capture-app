// @flow
import log from 'loglevel';
import { generateUID } from '../../../../utils/uid/generateUID';
import { actions as RelatedStageModes } from '../../../WidgetRelatedStages/constants';
import type { ConvertedRelatedStageEventProps } from './getConvertedRelatedStageEvent.types';
import { errorCreator } from '../../../../../capture-core-utils';

const getEventDetailsByLinkMode = ({
    relatedStageDataValues,
    requestEventIsFromConstraint,
    linkMode,
    relatedStageType,
    programId,
    teiId,
    enrollmentId,
    clientRequestEvent,
}) => {
    const baseEventDetails = {
        event: generateUID(),
        program: programId,
        programStage: requestEventIsFromConstraint ?
            relatedStageType.toConstraint.programStage.id
            : relatedStageType.fromConstraint.programStage.id,
        trackedEntity: teiId,
        enrollment: enrollmentId,
        dataValues: [],
        status: 'SCHEDULE',
    };

    if (linkMode === RelatedStageModes.SCHEDULE_IN_ORG) {
        const { scheduledAt: linkedEventScheduledAt, orgUnit: linkedEventOrgUnit } = relatedStageDataValues;

        return ({
            linkedEvent: {
                ...baseEventDetails,
                scheduledAt: linkedEventScheduledAt,
                orgUnit: linkedEventOrgUnit?.id,
            },
            linkedEventId: baseEventDetails.event,
        });
    } else if (linkMode === RelatedStageModes.ENTER_DATA) {
        return ({
            linkedEvent: {
                ...baseEventDetails,
                scheduledAt: clientRequestEvent.occurredAt,
                orgUnit: clientRequestEvent.orgUnit,
            },
            linkedEventId: baseEventDetails.event,
        });
    } else if (linkMode === RelatedStageModes.LINK_EXISTING_RESPONSE) {
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
    clientRequestEvent,
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
        clientRequestEvent,
    });

    const relationship = linkedEventId && {
        relationshipType: relatedStageType.id,
        from: {
            event: {
                event: requestEventIsFromConstraint ? clientRequestEvent.event : linkedEventId,
            },
        },
        to: {
            event: {
                event: requestEventIsFromConstraint ? linkedEventId : clientRequestEvent.event,
            },
        },
    };

    return {
        linkedEvent,
        relationship,
    };
};
