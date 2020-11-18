// @flow
import i18n from '@dhis2/d2-i18n';
import { type AssigneeFilterData, assigneeFilterModes } from '../../../../../FiltersForTypes';

const getText = (key) => {
    const keyToText = {
        [assigneeFilterModes.CURRENT]: i18n.t('Me'),
        [assigneeFilterModes.ANY]: i18n.t('Anyone'),
        [assigneeFilterModes.NONE]: i18n.t('None'),
    };

    // $FlowFixMe
    return keyToText[key];
};

export function convertAssignee(filter: AssigneeFilterData) {
    return (
        filter.assignedUserMode !== assigneeFilterModes.PROVIDED ?
            getText(filter.assignedUserMode) :
            // $FlowFixMe[incompatible-use] automated comment
            filter.assignedUser.name
    );
}
