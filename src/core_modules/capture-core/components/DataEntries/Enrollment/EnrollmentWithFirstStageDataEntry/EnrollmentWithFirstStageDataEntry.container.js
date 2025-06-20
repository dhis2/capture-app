// @flow
import React from 'react';
import type { Props } from './EnrollmentWithFirstStageDataEntry.types';
import { FirstStageDataEntry } from './EnrollmentWithFirstStageDataEntry.component';
import { useDataEntrySections } from './hooks';
import { Section } from '../../../../metaData';
import { RelatedStagesActions } from '../../../WidgetRelatedStages';
import { useProgramExpiryForUser } from '../../../../hooks';

const getSectionId = sectionId =>
    (sectionId === Section.MAIN_SECTION_ID ? `${Section.MAIN_SECTION_ID}-stage` : sectionId);

export const EnrollmentWithFirstStageDataEntry = (props: Props) => {
    const { firstStageMetaData, orgUnit, relatedStageRef, relatedStageActionsOptions, ...passOnProps } = props;
    const {
        stage: { stageForm: firstStageFormFoundation, name: stageName },
    } = firstStageMetaData;
    // $FlowFixMe[incompatible-type]
    const [[firstSectionId]] = firstStageFormFoundation.sections;
    const beforeSectionId = getSectionId(firstSectionId);
    const dataEntrySections = useDataEntrySections(stageName, beforeSectionId);
    const expiryPeriod = useProgramExpiryForUser(props.programId);

    return (
        <>
            <FirstStageDataEntry
                {...passOnProps}
                orgUnit={orgUnit}
                orgUnitId={orgUnit?.id}
                firstStageMetaData={firstStageMetaData}
                dataEntrySections={dataEntrySections}
                expiryPeriod={expiryPeriod}
            />
            <RelatedStagesActions
                ref={relatedStageRef}
                programId={passOnProps.programId}
                programStageId={firstStageMetaData.stage?.id}
                actionsOptions={relatedStageActionsOptions}
            />
        </>
    );
};
