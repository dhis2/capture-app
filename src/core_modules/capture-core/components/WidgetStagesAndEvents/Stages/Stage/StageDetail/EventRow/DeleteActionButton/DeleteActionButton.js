// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    colors,
    IconDelete16,
    MenuItem,
} from '@dhis2/ui';
import { pipe } from 'capture-core-utils';
import { ConditionalTooltip } from '../../../../../../Tooltips/ConditionalTooltip';
import { isValidPeriod } from '../../../../../../../utils/validation/validators/form';
import { convertClientToView, convertServerToClient } from '../../../../../../../converters';
import { dataElementTypes } from '../../../../../../../metaData';

const convertFn = pipe(convertServerToClient, convertClientToView);
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
    const occurredAtClientView = convertFn(occurredAt, dataElementTypes.DATE);

    return (
        <ConditionalTooltip
            content={i18n.t('{{occurredAt}} belongs to an expired period. Event cannot be deleted', {
                occurredAt: occurredAtClientView,
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

