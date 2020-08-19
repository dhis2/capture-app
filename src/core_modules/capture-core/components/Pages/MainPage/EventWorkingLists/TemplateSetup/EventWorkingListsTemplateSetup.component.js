// @flow
import React from 'react';
import { convertToEventFilterQueryCriteria } from '../helpers/eventFilters';
import { EventWorkingListsRowMenuSetup } from '../RowMenuSetup';

type Props = {

};

export const EventWorkingListsTemplateSetup = (props: Props) => (
    <EventWorkingListsRowMenuSetup
        {...props}
        convertToEventFilterQueryCriteria={convertToEventFilterQueryCriteria}
    />
);
