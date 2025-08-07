import i18n from '@dhis2/d2-i18n';
import type { AssigneeFilterData } from '../../../../../FiltersForTypes';
import { assigneeFilterModes } from '../../../../../FiltersForTypes';

const getText = (key: string): string => {
    const keyToText: Record<string, string> = {
        [assigneeFilterModes.CURRENT]: i18n.t('Me'),
        [assigneeFilterModes.ANY]: i18n.t('Anyone'),
        [assigneeFilterModes.NONE]: i18n.t('None'),
    };

    return keyToText[key];
};

export function convertAssignee(filter: AssigneeFilterData): string {
    return (
        filter.assignedUserMode !== assigneeFilterModes.PROVIDED ?
            getText(filter.assignedUserMode) :
            filter.assignedUser!.name
    );
}
