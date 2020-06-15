// @flow
import React from 'react';
import { convertToTemplateQueryCriteria } from './toTemplateQueryCriteriaConverter';
import { WorkingLists } from '../../WorkingLists';

type Props = {

};

export const EventWorkingListsTemplateSetup = (props: Props) => {
    const { ...passOnProps } = props;

    return (
        <WorkingLists
            {...passOnProps}
            convertToTemplateQueryCriteria={convertToTemplateQueryCriteria}
        />
    );
};
