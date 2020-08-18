// @flow
import React from 'react';
import { convertToEventFilterQueryCriteria } from '../helpers/eventFilters';
import { WorkingLists } from '../../WorkingLists';

type Props = {

};

export const EventWorkingListsTemplateSetup = (props: Props) => {
    const { ...passOnProps } = props;

    return (
        <WorkingLists
            {...passOnProps}
            convertToEventFilterQueryCriteria={convertToEventFilterQueryCriteria}
        />
    );
};
