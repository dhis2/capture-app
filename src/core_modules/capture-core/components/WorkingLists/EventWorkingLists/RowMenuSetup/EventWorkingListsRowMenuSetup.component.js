// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconDelete24, colors } from '@dhis2/ui';
import { EventWorkingListsUpdateTrigger } from '../UpdateTrigger';
import type { CustomRowMenuContents } from '../../WorkingListsBase';
import type { Props } from './eventWorkingListsRowMenuSetup.types';
import { useProgramExpiryForUser } from '../../../../hooks';


export const EventWorkingListsRowMenuSetup = ({ onDeleteEvent, programId, ...passOnProps }: Props) => {
    const expiryPeriod = useProgramExpiryForUser(programId);
    const customRowMenuContents: CustomRowMenuContents = useMemo(() => [{
        key: 'deleteEventItem',
        clickHandler: ({ id }) => onDeleteEvent(id),
        icon: <IconDelete24 color={colors.red400} />,
        label: i18n.t('Delete event'),
        expiredPeriod: expiryPeriod,
    }], [onDeleteEvent, expiryPeriod]);


    return (
        <EventWorkingListsUpdateTrigger
            {...passOnProps}
            programId={programId}
            customRowMenuContents={customRowMenuContents}
        />
    );
};
