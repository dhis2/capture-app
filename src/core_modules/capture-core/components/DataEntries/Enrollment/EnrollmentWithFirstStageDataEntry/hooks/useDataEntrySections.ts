import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';
import { placements } from '../../../../DataEntry/constants/placements.const';
import { sectionKeysForFirstStageDataEntry } from '../EnrollmentWithFirstStageDataEntry.constants';
import { AOCsectionKey } from '../../../../DataEntryDhis2Helpers';
import { LabelKeys, useTermLabel } from '../../../../../metaData';

export const useDataEntrySections = (stageName: string, beforeSectionId: string) => {
    const { enrollmentLabel } = useTermLabel([LabelKeys.enrollmentSingular]);
    return useMemo(
        () => ({
            [sectionKeysForFirstStageDataEntry.ENROLLMENT]: {
                placement: placements.TOP,
                name: capitalizeFirstLetter(enrollmentLabel),
            },
            [sectionKeysForFirstStageDataEntry.STAGE_BASIC_INFO]: {
                beforeSectionId,
                placement: placements.BEFORE_METADATA_BASED_SECTION,
                name: i18n.t('{{ stageName }} - Basic info', {
                    stageName,
                }),
            },
            [AOCsectionKey]: {
                beforeSectionId,
                placement: placements.BEFORE_METADATA_BASED_SECTION,
            },
            [sectionKeysForFirstStageDataEntry.ASSIGNEE]: {
                placement: placements.BOTTOM,
                name: i18n.t('{{ stageName }} - Assignee', {
                    stageName,
                }),
            },
            [sectionKeysForFirstStageDataEntry.STATUS]: {
                placement: placements.BOTTOM,
                name: i18n.t('{{ stageName }} - Status', {
                    stageName,
                }),
            },
        }),
        [stageName, beforeSectionId, enrollmentLabel],
    );
};
