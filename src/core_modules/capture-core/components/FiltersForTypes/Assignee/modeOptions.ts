import i18n from '@dhis2/d2-i18n';
import { assigneeFilterModes } from './assignee.const';

export function getModeOptions() {
    return [
        {
            name: i18n.t('Me'),
            value: assigneeFilterModes.CURRENT,
        },
        {
            name: i18n.t('Anyone'),
            value: assigneeFilterModes.ANY,
        },
        {
            name: i18n.t('None'),
            value: assigneeFilterModes.NONE,
        },
        {
            name: i18n.t('Select user'),
            value: assigneeFilterModes.PROVIDED,
        },
    ];
}
