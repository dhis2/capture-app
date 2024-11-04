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
        stage,
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

    if (!linkedEvent || !formFoundation || !stage) {
        return null;
    }

    return (
        <WidgetWrapper
            type={type}
            widget={
                <Widget
                    header={
                        <WidgetHeader
                            stage={stage}
                            linkedEvent={linkedEvent}
                            orgUnitId={orgUnitId}
                            currentPage={currentPage}
                            type={type}
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
