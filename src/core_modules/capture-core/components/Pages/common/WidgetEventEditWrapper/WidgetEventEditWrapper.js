// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { pageStatuses } from '../../EnrollmentEditEvent/EnrollmentEditEventPage.constants';
import { IncompleteSelectionsMessage } from '../../../IncompleteSelectionsMessage';
import { WidgetEventEdit } from '../../../WidgetEventEdit';
import type { Props } from '../../../WidgetEventEdit/widgetEventEdit.types';
import {
    useMetadataForEnrollmentEventForm,
} from '../../../WidgetEnrollmentEventNew/DataEntry/hooks/useMetadataForEnrollmentEventForm';

type WidgetProps = {|
    pageStatus: string,
    ...Props,
|}

export const WidgetEventEditWrapper = ({ pageStatus, programId, stageId, ...passOnProps }: WidgetProps) => {
    const {
        formFoundation,
        stage,
        isLoading,
        isError,
    } = useMetadataForEnrollmentEventForm({ programId, stageId });

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

    if (isLoading || !formFoundation || !stage || isError) {
        return (
            <div>
                {i18n.t('Loading')}
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
