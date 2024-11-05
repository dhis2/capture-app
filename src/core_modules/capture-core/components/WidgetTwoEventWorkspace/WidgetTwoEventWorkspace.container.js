// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './WidgetTwoEventWorkspace.types';
import { useMetadataForProgramStage } from '../DataEntries/common/ProgramStage/useMetadataForProgramStage';
import { Widget } from '../Widget';
import { useLinkedEventByOriginId } from './hooks/useLinkedEventByOriginId';
import { WidgetTwoEventWorkspaceComponent } from './WidgetTwoEventWorkspace.component';
import { useClientDataValues } from './hooks/useClientDataValues';
import { WidgetWrapper } from './WidgetWrapper';
import { WidgetHeader } from './WidgetHeader';

export const WidgetTwoEventWorkspace = ({
    eventId,
    programId,
    orgUnitId,
    currentPage,
    stage,
    type,
}: Props) => {
    const {
        linkedEvent,
        dataValues,
        isError: isLinkedEventError,
        isLoading: isLinkedEventLoading,
    } = useLinkedEventByOriginId({ originEventId: eventId });

    const {
        formFoundation,
        stage: linkedStage,
        isLoading: isLoadingMetadata,
        isError: isMetadataError,
    } = useMetadataForProgramStage({
        programId,
        stageId: linkedEvent?.programStage,
    });

    const {
        clientValuesWithSubValues,
        isLoading: isLoadingClientValues,
        isError: isClientValuesError,
    } = useClientDataValues({
        linkedEventId: linkedEvent?.event,
        dataValues,
        formFoundation,
    });

    if (isLinkedEventLoading || isLoadingMetadata || isLoadingClientValues) {
        return null;
    }

    if (isLinkedEventError || isMetadataError || isClientValuesError) {
        return (
            <div>
                {i18n.t('An error occurred while loading the widget.')}
            </div>
        );
    }

    if (!linkedEvent || !formFoundation || !linkedStage) {
        return null;
    }

    return (
        <WidgetWrapper
            type={type}
            stage={stage}
            linkedStage={linkedStage}
            widget={
                <Widget
                    header={
                        <WidgetHeader
                            linkedStage={linkedStage}
                            linkedEvent={linkedEvent}
                            orgUnitId={orgUnitId}
                            currentPage={currentPage}
                        />
                    }
                    noncollapsible
                >
                    <WidgetTwoEventWorkspaceComponent
                        linkedEvent={linkedEvent}
                        formFoundation={formFoundation}
                        dataValues={clientValuesWithSubValues}
                    />
                </Widget>
            }
        />
    );
};
