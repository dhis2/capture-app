// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { getProgramAndStageForProgram, TrackerProgram } from '../../metaData';
import { AccessVerification } from './AccessVerification';
import type { WidgetProps } from './WidgetEnrollmentEventNew.types';
import { useMetadataForProgramStage } from '../DataEntries/common/ProgramStage/useMetadataForProgramStage';

export const WidgetEnrollmentEventNew = ({
    programId,
    stageId,
    onSave,
    ...passOnProps
}: WidgetProps) => {
    const { program } = useMemo(() => getProgramAndStageForProgram(programId, stageId), [programId, stageId]);
    const {
        stage,
        formFoundation,
        isLoading,
        isError,
    } = useMetadataForProgramStage({ programId, stageId });

    if (isLoading) {
        return (
            <div>
                {i18n.t('Loading')}
            </div>
        );
    }

    if (!program || !stage || !(program instanceof TrackerProgram) || isError || !formFoundation) {
        return (
            <div>
                {i18n.t('program or stage is invalid')};
            </div>
        );
    }

    return (
        <AccessVerification
            {...passOnProps}
            stage={stage}
            formFoundation={formFoundation}
            program={program}
            onSaveExternal={onSave}
        />
    );
};
