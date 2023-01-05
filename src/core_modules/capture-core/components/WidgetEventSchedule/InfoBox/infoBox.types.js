// @flow

export type Props = {|
    scheduleDate?: ?string,
    suggestedScheduleDate?: ?string,
    eventCountInOrgUnit: number,
    orgUnitName?: ?string,
    hideDueDate?: boolean,
    ...CssClasses,
|};
