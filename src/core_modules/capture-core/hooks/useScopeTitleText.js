// @flow
import i18n from '@dhis2/d2-i18n';
import { scopeTypes } from '../metaData';
import { useScopeInfo } from './useScopeInfo';

export const useScopeTitleText = (scopeId: ?string) => {
    const { trackedEntityName, programName, scopeType } = useScopeInfo(scopeId);

    const text = {
        [scopeTypes.EVENT_PROGRAM]: programName,
        [scopeTypes.TRACKER_PROGRAM]:
            i18n.t('{{trackedEntityName}} in program{{escape}} {{programName}}', {
                trackedEntityName,
                escape: ':',
                programName,
                interpolation: { escapeValue: false },
            }),
        [scopeTypes.TRACKED_ENTITY_TYPE]: trackedEntityName,
    };

    return scopeType ? text[scopeType] : '';
};
