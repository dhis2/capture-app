// @flow
import type { ReferralDataValueStates } from '../WidgetEnrollmentEventNew/Validated/validated.types';
import type { Relationship } from '../Relationships/relationships.types';

export type Props = {|
    programStageId: string,
    referralDataValues: ReferralDataValueStates,
    onSelectReferralType: (?Relationship) => void,
    setReferralDataValues: (() => Object) => void,
|}
