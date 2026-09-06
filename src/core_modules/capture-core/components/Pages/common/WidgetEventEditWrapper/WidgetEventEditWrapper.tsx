import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { pageStatuses } from '../../EnrollmentEditEvent/EnrollmentEditEventPage.constants';
import { IncompleteSelectionsMessage } from '../../../IncompleteSelectionsMessage';
import { WidgetEventEdit } from '../../../WidgetEventEdit';
import type { Props } from '../../../WidgetEventEdit/widgetEventEdit.types';
import { useMetadataForProgramStage } from '../../../DataEntries/common/ProgramStage/useMetadataForProgramStage';
import { LabelKeys, useTermLabel } from '../../../../metaData';

type WidgetProps = {
    pageStatus: string;
} & Props;

export const WidgetEventEditWrapper = ({ pageStatus, ...passOnProps }: WidgetProps) => {
    const {
        programId,
        stageId,
    } = passOnProps;

    const {
        formFoundation,
        stage,
        isLoading,
        isError,
    } = useMetadataForProgramStage({ programId, stageId });
    const { enrollmentLabel, orgUnitLabel, eventLabel } = useTermLabel(
        [LabelKeys.enrollmentSingular, LabelKeys.orgUnitSingular, LabelKeys.eventSingular],
        { programId },
    );

    if (pageStatus === pageStatuses.WITHOUT_ORG_UNIT_SELECTED) {
        return (
            <IncompleteSelectionsMessage>
                {i18n.t('Choose an {{orgUnitLabel}} to start reporting', { orgUnitLabel })}
            </IncompleteSelectionsMessage>
        );
    }

    if (pageStatus === pageStatuses.MISSING_DATA) {
        return (
            <span>
                {i18n.t('The {{enrollmentLabel}} {{eventLabel}} data could not be found', {
                    enrollmentLabel,
                    eventLabel,
                })}
            </span>
        );
    }

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
        <WidgetEventEdit
            {...passOnProps}
            stage={stage}
            formFoundation={formFoundation}
            programId={programId}
            stageId={stageId}
        />
    );
};
