// @flow
import { getModeOptions } from './modeOptions';

export function getAssigneeFilterData(value: Object) {
    return {
        requestData: {
            assignedUserMode: value.mode,
            assignedUser: value.provided && value.provided.id,
        },
        appliedText: value.provided ? value.provided.name : getModeOptions().find(o => o.value === value.mode).name,
    };
}
