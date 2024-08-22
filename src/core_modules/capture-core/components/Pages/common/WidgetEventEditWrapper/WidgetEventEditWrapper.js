// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { pageStatuses } from '../../EnrollmentEditEvent/EnrollmentEditEventPage.constants';
import { IncompleteSelectionsMessage } from '../../../IncompleteSelectionsMessage';
import { WidgetEventEdit } from '../../../WidgetEventEdit';
import type { Props } from '../../../WidgetEventEdit/widgetEventEdit.types';
import { useMetadataForProgramStage } from '../../../DataEntries/common/ProgramStage/useMetadataForProgramStage';

type WidgetProps = {|
    pageStatus: string,
    ...Props,
|}

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

    if (pageStatus === pageStatuses.WITHOUT_ORG_UNIT_SELECTED) {
        return (
            <IncompleteSelectionsMessage>
                {i18n.t('Choose an organisation unit to start reporting')}
            </IncompleteSelectionsMessage>
        );
    }

    if (pageStatus === pageStatuses.MISSING_DATA) {
        return (
            <span>{i18n.t('The enrollment event data could not be found')}</span>
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
