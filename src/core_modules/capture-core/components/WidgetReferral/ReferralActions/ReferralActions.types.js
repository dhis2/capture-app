// @flow

import type { ReferralDataValueStates } from '../../WidgetEnrollmentEventNew/Validated/validated.types';

type Constraint = {
    programStage: {
        id: string,
    },
    relationshipEntity: 'PROGRAM_STAGE_INSTANCE',
}

export type Props = {|
    type: string,
    selectedType: Object,
    referralDataValues: ReferralDataValueStates,
    scheduledLabel: string,
    saveAttempted: boolean,
    errorMessages: Object,
    constraint: ?Constraint,
    addErrorMessage: (Object) => void,
    setReferralDataValues: (() => Object) => void,
    ...CssClasses
|}
