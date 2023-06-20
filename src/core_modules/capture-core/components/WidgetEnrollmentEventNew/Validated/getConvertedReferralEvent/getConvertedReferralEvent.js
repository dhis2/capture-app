// @flow
import { generateUID } from '../../../../utils/uid/generateUID';
import type { ConvertedReferralEventProps } from './getConvertedReferralEvent.types';

export const getConvertedReferralEvent = ({
    referralDataValues,
    programId,
    teiId,
    currentProgramStageId,
    currentEventId,
    enrollmentId,
    referralType,
}: ConvertedReferralEventProps) => {
    const { scheduledAt: referralScheduledAt, orgUnit: referralOrgUnit } = referralDataValues;

    const requestEventIsFromConstraint = referralType.fromConstraint.programStage.id === currentProgramStageId;

    const referralEvent = {
        event: generateUID(),
        program: programId,
        programStage: requestEventIsFromConstraint ?
            referralType.toConstraint.programStage.id
            : referralType.fromConstraint.programStage.id,
        trackedEntity: teiId,
        enrollment: enrollmentId,
        scheduledAt: referralScheduledAt,
        orgUnit: referralOrgUnit?.id,
        dataValues: [],
        status: 'SCHEDULE',
    };

    const relationship = {
        relationshipType: referralType.id,
        from: {
            event: {
                event: requestEventIsFromConstraint ? currentEventId : referralEvent.event,
            },
        },
        to: {
            event: {
                event: requestEventIsFromConstraint ? referralEvent.event : currentEventId,
            },
        },
    };

    return {
        referralEvent,
        relationship,
    };
};
