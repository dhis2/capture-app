// @flow
import log from 'loglevel';
import { generateUID } from '../../../../utils/uid/generateUID';
import { actions as ReferralModes } from '../../../WidgetReferral/constants';
import type { ConvertedReferralEventProps } from './getConvertedReferralEvent.types';
import { errorCreator } from '../../../../../capture-core-utils';

const getEventDetailsByReferralMode = ({
    referralDataValues,
    requestEventIsFromConstraint,
    referralMode,
    referralType,
    programId,
    teiId,
    enrollmentId,
    clientRequestEvent,
}) => {
    const baseEventDetails = {
        event: generateUID(),
        program: programId,
        programStage: requestEventIsFromConstraint ?
            referralType.toConstraint.programStage.id
            : referralType.fromConstraint.programStage.id,
        trackedEntity: teiId,
        enrollment: enrollmentId,
        dataValues: [],
        status: 'SCHEDULE',
    };

    if (referralMode === ReferralModes.REFER_ORG) {
        const { scheduledAt: referralScheduledAt, orgUnit: referralOrgUnit } = referralDataValues;

        return ({
            referralEvent: {
                ...baseEventDetails,
                scheduledAt: referralScheduledAt,
                orgUnit: referralOrgUnit?.id,
            },
            linkedEventId: baseEventDetails.event,
        });
    } else if (referralMode === ReferralModes.ENTER_DATA) {
        return ({
            referralEvent: {
                ...baseEventDetails,
                scheduledAt: clientRequestEvent.occurredAt,
                orgUnit: clientRequestEvent.orgUnit,
            },
            linkedEventId: baseEventDetails.event,
        });
    } else if (referralMode === ReferralModes.LINK_EXISTING_RESPONSE) {
        const { linkedEventId } = referralDataValues;
        return {
            referralEvent: null,
            linkedEventId,
        };
    }

    log.error(errorCreator(`Referral mode ${referralMode} is not supported`)());
    return {
        referralEvent: null,
        linkedEventId: null,
    };
};

export const getConvertedReferralEvent = ({
    referralMode,
    referralDataValues,
    programId,
    teiId,
    currentProgramStageId,
    clientRequestEvent,
    enrollmentId,
    referralType,
}: ConvertedReferralEventProps) => {
    const requestEventIsFromConstraint = referralType.fromConstraint.programStage.id === currentProgramStageId;

    const { referralEvent, linkedEventId } = getEventDetailsByReferralMode({
        referralDataValues,
        requestEventIsFromConstraint,
        referralMode,
        referralType,
        programId,
        teiId,
        enrollmentId,
        clientRequestEvent,
    });

    const relationship = {
        relationshipType: referralType.id,
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
        referralEvent,
        relationship,
    };
};
