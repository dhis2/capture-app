import React from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    colors,
    IconDelete16,
    MenuItem,
} from '@dhis2/ui';
import { ConditionalTooltip } from '../../../../../../Tooltips/ConditionalTooltip';
import { convertClientToView, convertServerToClient } from '../../../../../../../converters';
import { dataElementTypes, useStageLabel, type ProgramStage } from '../../../../../../../metaData';
import { useEventEditPermissions } from '../../../../../../../hooks';

type Props = {
    setActionsOpen: (open: boolean) => void;
    setDeleteModalOpen: (open: boolean) => void;
    occurredAt: string;
    completedAt?: string;
    eventStatus?: string;
    programId: string;
    programStage?: ProgramStage | null;
};

export const DeleteActionButton = ({
    setActionsOpen,
    setDeleteModalOpen,
    occurredAt,
    completedAt,
    eventStatus,
    programId,
    programStage,
}: Props) => {
    const occurredAtClient = convertServerToClient(occurredAt, dataElementTypes.DATE) as string;
    const occurredAtClientView = convertClientToView(occurredAtClient, dataElementTypes.DATE);
    const event = useStageLabel('event', { programId, stageId: programStage?.id }) ?? i18n.t('Event');

    const {
        isEventWithinValidPeriod,
        canEditCompletedEvent,
        readOnly,
    } = useEventEditPermissions({
        programId,
        stage: programStage,
        eventStatus,
        occurredAtClient,
        completedAtClient: convertServerToClient(completedAt, dataElementTypes.DATE) as string,
    });

    const getDisabledMessage = (): string => {
        if (!isEventWithinValidPeriod) {
            return i18n.t('{{occurredAt}} belongs to an expired period. {{event}} cannot be deleted', {
                occurredAt: occurredAtClientView,
                event,
                interpolation: { escapeValue: false },
            });
        }
        if (!canEditCompletedEvent) {
            return i18n.t('This {{event}} has been completed', {
                event,
                interpolation: { escapeValue: false },
            });
        }
        return i18n.t('This {{event}} is outside the edit period', {
            event,
            interpolation: { escapeValue: false },
        });
    };

    return (
        <ConditionalTooltip
            content={getDisabledMessage()}
            enabled={readOnly}
        >
            <MenuItem
                dense
                disabled={readOnly}
                icon={<IconDelete16 color={colors.red600} />}
                label={i18n.t('Delete')}
                dataTest="stages-and-events-delete"
                onClick={() => {
                    setDeleteModalOpen(true);
                    setActionsOpen(false);
                }}
                suffix=""
            />
        </ConditionalTooltip>
    );
};
