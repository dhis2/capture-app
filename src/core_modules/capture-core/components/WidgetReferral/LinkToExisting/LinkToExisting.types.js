// @flow

import type { LinkableEvent } from '../ReferralActions/ReferralActions.types';
import type { ReferralDataValueStates } from '../WidgetReferral.types';

export type LinkToExistingProps = {|
    referralDataValues: ReferralDataValueStates,
    setReferralDataValues: (ReferralDataValueStates) => void,
    linkableEvents: Array<LinkableEvent>,
    referralProgramStageLabel: string,
    ...CssClasses,
|}
