// @flow
import React, { useMemo, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { FirstStageRegistrationComponent } from './FirstStageRegistration.component';
import { placements } from '../../DataEntry/constants/placements.const';
import { sectionKeysForFirstStageDataEntry } from './FirstStageRegistration.constants';
import { type ProgramStage } from '../../../metaData';

type Props = {
    firstStageMetaData?: {
        stage: ProgramStage,
    },
};

export const FirstStageRegistrationContainer = (props: Props) => {
    const { firstStageMetaData } = props;
    const stageName = useMemo(() => firstStageMetaData?.stage?.name, [firstStageMetaData]);
    const firstStageDataEntrySectionDefinitions = useMemo(
        () => ({
            [sectionKeysForFirstStageDataEntry.STAGE_BASIC_INFO]: {
                placement: placements.TOP,
                name: i18n.t('Data Entry ({{ stageName }})', {
                    stageName,
                }),
            },
            [sectionKeysForFirstStageDataEntry.STATUS]: {
                placement: placements.BOTTOM,
                name: i18n.t('Status'),
            },
        }),
        [stageName],
    );
    const onGetCustomSectionName = useCallback(
        (sectionName) => {
            if (sectionName) {
                return i18n.t('Data Entry ({{ stageName }} - {{ sectionName }})', {
                    stageName,
                    sectionName,
                });
            }

            return i18n.t('Data Entry ({{ stageName }})', {
                stageName,
            });
        },
        [stageName],
    );

    return (
        <FirstStageRegistrationComponent
            {...props}
            firstStageDataEntrySectionDefinitions={firstStageDataEntrySectionDefinitions}
            onGetCustomSectionName={sectionName => onGetCustomSectionName(sectionName)}
        />
    );
};
