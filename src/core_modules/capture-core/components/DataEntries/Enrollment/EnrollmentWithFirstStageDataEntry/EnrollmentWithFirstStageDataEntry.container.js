// @flow
import React, { useMemo } from 'react';
import type { Props } from './EnrollmentWithFirstStageDataEntry.types';
import { FirstStageDataEntry } from './EnrollmentWithFirstStageDataEntry.component';
import { useMergeFormFoundations, useDataEntrySections } from './hooks';

export const EnrollmentWithFirstStageDataEntry = (props: Props) => {
    const { firstStageMetaData, enrollmentFormFoundation, ...passOnProps } = props;
    const {
        stage: { stageForm: firstStageFormFoundation },
    } = firstStageMetaData;

    const stageName = useMemo(() => firstStageMetaData?.stage?.name, [firstStageMetaData]);
    const dataEntrySections = useDataEntrySections(stageName);
    const formFoundation = useMergeFormFoundations(enrollmentFormFoundation, firstStageFormFoundation, stageName);

    return (
        <FirstStageDataEntry
            {...passOnProps}
            firstStageMetaData={firstStageMetaData}
            dataEntrySections={dataEntrySections}
            formFoundation={formFoundation}
        />
    );
};
