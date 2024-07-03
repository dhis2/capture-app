// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useMetadataForProgramStage } from '../../DataEntries/common/ProgramStage/useMetadataForProgramStage';
import { dataEntryIds } from '../../../constants';
import { ViewEventDataEntry } from '../ViewEventDataEntry';

type Props = {|
    programId: string,
    eventId: string,
    stageId: string,
    relationships: Array<any>,
|}

export const TwoEventWorkspace = ({
    programId,
    stageId,
    relationships,
}: Props) => {
    const { formFoundation, stage, isLoading, isError } = useMetadataForProgramStage({
        programId,
        stageId: relationships[0].from.event.programStage,
    });

    if (isLoading) {
        return (
            <div>
                {i18n.t('Loading')}
            </div>
        );
    }

    if (!formFoundation || !stage || isError) {
        return (
            <div>
                {i18n.t('An error occurred while loading the form')}
            </div>
        );
    }

    return (
        <div>
            <ViewEventDataEntry
                programId={programId}
                formFoundation={formFoundation}
                dataEntryId={dataEntryIds.LINKED_ENROLLMENT_EVENT}
                hideDueDate={stage.hideDueDate}
            />
        </div>
    );
};
