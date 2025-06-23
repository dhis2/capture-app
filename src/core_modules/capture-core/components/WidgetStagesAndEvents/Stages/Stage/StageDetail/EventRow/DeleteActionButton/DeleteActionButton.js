// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    colors,
    IconDelete16,
    MenuItem,
} from '@dhis2/ui';
import { ConditionalTooltip } from '../../../../../../Tooltips/ConditionalTooltip';
import { isValidPeriod } from '../../../../../../../utils/validation/validators/form';
import { convertClientToView } from '../../../../../../../converters';
import { dataElementTypes } from '../../../../../../../metaData';

type Props = {
    setActionsOpen: (open: boolean) => void,
    setDeleteModalOpen: (open: boolean) => void,
    occurredAt: string,
    expiryPeriod?: {
        expiryPeriodType: ?string,
        expiryDays: ?number,
    },
};

export const DeleteActionButton = ({
    setActionsOpen,
    setDeleteModalOpen,
    occurredAt,
    expiryPeriod,
}: Props) => {
    const { isWithinValidPeriod } = isValidPeriod(occurredAt, expiryPeriod);
    const occurredAtClient = convertClientToView(occurredAt, dataElementTypes.DATE);

    return (
        <ConditionalTooltip
            content={i18n.t('{{eventDate}} belongs to an expired period. Event cannot be edited', {
                eventDate: occurredAtClient,
                interpolation: { escapeValue: false },
            })}
            enabled={!isWithinValidPeriod}
        >
            <MenuItem
                dense
                disabled={!isWithinValidPeriod}
                icon={<IconDelete16 color={colors.red600} />}
                label={i18n.t('Delete')}
                dataTest="stages-and-events-delete"
                onClick={() => {
                    setDeleteModalOpen(true);
                    setActionsOpen(false);
                }}
            /></ConditionalTooltip>
    );
};

