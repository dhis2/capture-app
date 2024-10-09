// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconDelete24, colors } from '@dhis2/ui';
import { EventWorkingListsUpdateTrigger } from '../UpdateTrigger';
import type { CustomRowMenuContents } from '../../WorkingListsBase';
import type { Props } from './eventWorkingListsRowMenuSetup.types';


export const EventWorkingListsRowMenuSetup = ({ onDeleteEvent, ...passOnProps }: Props) => {
    const customRowMenuContents: CustomRowMenuContents = useMemo(() => [{
        key: 'deleteEventItem',
        clickHandler: ({ id }) => onDeleteEvent(id),
        icon: <IconDelete24 color={colors.red400} />,
        label: i18n.t('Delete event'),
    }], [onDeleteEvent]);

    return (
        <EventWorkingListsUpdateTrigger
            {...passOnProps}
            customRowMenuContents={customRowMenuContents}
        />
    );
};
