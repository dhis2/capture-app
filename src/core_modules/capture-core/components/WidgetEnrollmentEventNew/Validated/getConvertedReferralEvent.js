import { systemSettingsStore } from '../../../metaDataMemoryStores';
import { isValidDate, isValidOrgUnit } from '../../../../capture-core-utils/validators/form';
import { generateUID } from '../../../utils/uid/generateUID';

export const getConvertedReferralEvent = ({
    referralDataValues,
    programId,
    teiId,
    currentProgramStageId,
    currentEventId,
    enrollmentId,
    referralType,
}) => {
    const { scheduledAt: referralScheduledAt, orgUnit: referralOrgUnit } = referralDataValues;
    const defaultReturnValues = {
        isValid: false,
        referralEvent: {},
        relationship: {},
    };

    if (!referralScheduledAt || !referralOrgUnit) {
        return defaultReturnValues;
    }

    const dateFormat = systemSettingsStore.get().dateFormat;
    const formIsValid = isValidDate(referralScheduledAt, dateFormat) && isValidOrgUnit(referralOrgUnit);

    if (!formIsValid) {
        return defaultReturnValues;
    }

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
        orgUnit: referralOrgUnit.id,
        dataValues: [],
        status: 'SCHEDULE',
    };

    const relationship = {
        relationshipType: referralType.id,
        from: {
            event: {
                event: requestEventIsFromConstraint ? currentEventId : referralEvent.programStage,
            },
        },
        to: {
            event: {
                event: requestEventIsFromConstraint ? referralEvent.event : currentEventId,
            },
        },
    };

    return {
        isValid: formIsValid,
        referralEvent,
        relationship,
    };
};
