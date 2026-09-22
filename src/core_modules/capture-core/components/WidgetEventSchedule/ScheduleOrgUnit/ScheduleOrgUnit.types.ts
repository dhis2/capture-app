import type { OrgUnitValue } from '../widgetEventSchedule.types';

export type PlainProps = {
    onSelectOrgUnit: (orgUnit: OrgUnitValue) => void;
    onDeselectOrgUnit: () => void;
    orgUnit?: OrgUnitValue | null;
    saveAttempted: boolean;
};
