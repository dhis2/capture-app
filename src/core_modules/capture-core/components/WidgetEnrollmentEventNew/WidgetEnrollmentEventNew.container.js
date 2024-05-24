// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { getProgramAndStageForProgram, TrackerProgram } from '../../metaData';
import { AccessVerification } from './AccessVerification';
import type { WidgetProps } from './WidgetEnrollmentEventNew.types';

export const WidgetEnrollmentEventNew = ({
    programId,
    stageId,
    onSave,
    ...passOnProps
}: WidgetProps) => {
    const { program, stage } = useMemo(() => getProgramAndStageForProgram(programId, stageId), [programId, stageId]);

    if (!program || !stage || !(program instanceof TrackerProgram)) {
        return (
            <div>
                {i18n.t('program or stage is invalid')};
            </div>
        );
    }

    const formFoundation = stage.stageForm;

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
