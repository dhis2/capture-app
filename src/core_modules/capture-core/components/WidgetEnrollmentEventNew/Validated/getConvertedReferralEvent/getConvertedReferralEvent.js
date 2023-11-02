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
            ...baseEventDetails,
            scheduledAt: referralScheduledAt,
            orgUnit: referralOrgUnit?.id,
        });
    } else if (referralMode === ReferralModes.ENTER_DATA) {
        return ({
            ...baseEventDetails,
            scheduledAt: clientRequestEvent.occurredAt,
            orgUnit: clientRequestEvent.orgUnit,
        });
    }

    log.error(errorCreator(`Referral mode ${referralMode} is not supported`)());
    return {
        ...baseEventDetails,
        orgUnit: '',
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

    const referralEvent = getEventDetailsByReferralMode({
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
                event: requestEventIsFromConstraint ? clientRequestEvent.event : referralEvent.event,
            },
        },
        to: {
            event: {
                event: requestEventIsFromConstraint ? referralEvent.event : clientRequestEvent.event,
            },
        },
    };

    return {
        referralEvent,
        relationship,
    };
};
