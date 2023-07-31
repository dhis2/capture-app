// @flow
import React from 'react';
import type { Props } from './EnrollmentWithFirstStageDataEntry.types';
import { FirstStageDataEntry } from './EnrollmentWithFirstStageDataEntry.component';
import { useDataEntrySections } from './hooks';
import { Section } from '../../../../metaData';

const getSectionId = sectionId =>
    (sectionId === Section.MAIN_SECTION_ID ? `${Section.MAIN_SECTION_ID}-stage` : sectionId);

export const EnrollmentWithFirstStageDataEntry = (props: Props) => {
    const { firstStageMetaData, ...passOnProps } = props;
    const {
        stage: { stageForm: firstStageFormFoundation, name: stageName },
    } = firstStageMetaData;
    // $FlowFixMe[incompatible-type]
    const [[firstSectionId]] = firstStageFormFoundation.sections;
    const beforeSectionId = getSectionId(firstSectionId);
    const dataEntrySections = useDataEntrySections(stageName, beforeSectionId);

    return (
        <FirstStageDataEntry
            {...passOnProps}
            firstStageMetaData={firstStageMetaData}
            dataEntrySections={dataEntrySections}
        />
    );
};
