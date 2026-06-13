import React from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    colors,
    IconDelete16,
    MenuItem,
} from '@dhis2/ui';
import { pipe } from 'capture-core-utils';
import { ConditionalTooltip } from '../../../../../../Tooltips/ConditionalTooltip';
import { isValidPeriod, isWithinCompleteEventsExpiry } from '../../../../../../../utils/validation/validators/form';
import { convertClientToView, convertServerToClient } from '../../../../../../../converters';
import { dataElementTypes } from '../../../../../../../metaData';
import { eventStatuses } from '../../../../../../WidgetEventEdit/constants/status.const';
import { useAuthorities } from '../../../../../../../utils/authority/useAuthorities';

const convertFn = pipe(convertServerToClient, convertClientToView);
type Props = {
    setActionsOpen: (open: boolean) => void;
    setDeleteModalOpen: (open: boolean) => void;
    occurredAt: string;
    completedAt?: string;
    eventStatus?: string;
    blockEntryForm?: boolean;
    expiryPeriod?: {
        expiryPeriodType?: string | null;
        expiryDays?: number | null;
    };
    completeEventsExpiryDays?: number;
};

export const DeleteActionButton = ({
    setActionsOpen,
    setDeleteModalOpen,
    occurredAt,
    completedAt,
    eventStatus,
    blockEntryForm,
    expiryPeriod,
    completeEventsExpiryDays,
}: Props) => {
    const { hasAuthority: canEditExpired } = useAuthorities({ authorities: ['F_EDIT_EXPIRED'] });
    const { isWithinValidPeriod } = isValidPeriod(occurredAt, expiryPeriod);
    const occurredAtClientView = convertFn(occurredAt, dataElementTypes.DATE);

    const completedAtClient = convertServerToClient(completedAt, dataElementTypes.DATE) as string;
    const isWithinCompleteExpiry = isWithinCompleteEventsExpiry(completedAtClient, completeEventsExpiryDays);
    const canEditCompletedEvent = canEditExpired || !(blockEntryForm && eventStatus === eventStatuses.COMPLETED);

    const canDelete = isWithinValidPeriod && isWithinCompleteExpiry && canEditCompletedEvent;

    const getDisabledMessage = (): string => {
        if (!isWithinValidPeriod) {
            return i18n.t('{{occurredAt}} belongs to an expired period. Event cannot be deleted', {
                occurredAt: occurredAtClientView,
                interpolation: { escapeValue: false },
            });
        }
        if (!canEditCompletedEvent) {
            return i18n.t('This event has been completed');
        }
        return i18n.t('This event is outside the edit period');
    };

    return (
        <ConditionalTooltip
            content={getDisabledMessage()}
            enabled={!canDelete}
        >
            <MenuItem
                dense
                disabled={!canDelete}
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
