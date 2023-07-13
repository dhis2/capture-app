// @flow
import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { placements } from '../../../../DataEntry/constants/placements.const';
import { sectionKeysForFirstStageDataEntry } from '../EnrollmentWithFirstStageDataEntry.constants';
import { AOCsectionKey } from '../../../../DataEntryDhis2Helpers';

export const useDataEntrySections = (stageName?: string) =>
    useMemo(
        () => ({
            [sectionKeysForFirstStageDataEntry.ENROLLMENT]: {
                placement: placements.TOP,
                name: i18n.t('Enrollment'),
            },
            [sectionKeysForFirstStageDataEntry.STAGE_BASIC_INFO]: {
                placement: placements.MIDDLE,
                name: i18n.t('Data Entry ({{ stageName }})', {
                    stageName,
                }),
            },
            [AOCsectionKey]: {
                placement: placements.MIDDLE,
            },
            [sectionKeysForFirstStageDataEntry.STATUS]: {
                placement: placements.BOTTOM,
                name: i18n.t('Status'),
            },
        }),
        [stageName],
    );
