// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { FirstStageRegistrationComponent } from './FirstStageRegistration.component';
import { placements } from '../../DataEntry/constants/placements.const';
import { sectionKeysForFirstStageDataEntry } from './FirstStageRegistration.constants';
import { type ProgramStage, RenderFoundation } from '../../../metaData';

type Props = {
    firstStageMetaData?: {
        stage: ProgramStage,
    }
}
export const FirstStageRegistrationContainer = (props: Props) => {
    const { firstStageMetaData } = props;
    const firstStageDataEntrySectionDefinitions = useMemo(() => ({
        [sectionKeysForFirstStageDataEntry.STAGE_BASIC_INFO]: {
            placement: placements.TOP,
            name: i18n.t('Data Entry ({{ stageName }})', {
                stageName: firstStageMetaData?.stage?.name,
            }),
        },
        [sectionKeysForFirstStageDataEntry.STATUS]: {
            placement: placements.BOTTOM,
            name: i18n.t('Status'),
        } }
    ), [firstStageMetaData]);

    return (<FirstStageRegistrationComponent
        {...props}
        firstStageDataEntrySectionDefinitions={firstStageDataEntrySectionDefinitions}
    />);
};
