// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconDelete24, colors } from '@dhis2/ui';
import { EventWorkingListsUpdateTrigger } from '../UpdateTrigger';
import type { CustomRowMenuContents } from '../../WorkingListsBase';
import type { Props } from './eventWorkingListsRowMenuSetup.types';
import { useProgramExpiryForUser } from '../../../../hooks';
import { isValidPeriod } from '../../../../utils/validation/validators/form';


export const EventWorkingListsRowMenuSetup = ({ onDeleteEvent, programId, ...passOnProps }: Props) => {
    const expiryPeriod = useProgramExpiryForUser(programId);

    const customRowMenuContents: CustomRowMenuContents = useMemo(() => [{
        key: 'deleteEventItem',
        clickHandler: ({ id }) => onDeleteEvent(id),
        icon: <IconDelete24 color={colors.red400} />,
        label: i18n.t('Delete event'),
        tooltipContent: (row) => {
            const { occurredAt } = row ?? {};
            const { isWithinValidPeriod } = isValidPeriod(occurredAt, expiryPeriod);
            return isWithinValidPeriod ? null : i18n.t('{{occurredAt}} belongs to an expired period. Event cannot be edited', {
                occurredAt,
                interpolation: { escapeValue: false },
            });
        },
        tooltipEnabled: (row) => {
            const { occurredAt } = row ?? {};
            const { isWithinValidPeriod } = isValidPeriod(occurredAt, expiryPeriod);
            return !isWithinValidPeriod;
        },
        disabled: (row) => {
            const { occurredAt } = row ?? {};
            const { isWithinValidPeriod } = isValidPeriod(occurredAt, expiryPeriod);
            return !isWithinValidPeriod;
        },
    }], [onDeleteEvent, expiryPeriod]);


    return (
        <EventWorkingListsUpdateTrigger
            {...passOnProps}
            programId={programId}
            customRowMenuContents={customRowMenuContents}
        />
    );
};
