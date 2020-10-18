// @flow
import React, { useMemo } from 'react';
import { WorkingLists } from '../../WorkingLists';
import type { Props } from './workingListsInterfaceBuilder.types';

export const WorkingListsInterfaceBuilder = ({ program, templates, ...passOnProps }: Props) => {
    const workingListsTemplates = useMemo(() =>
        (templates || [])
            .map(template => ({
                ...template,
                updating: !!template.nextCriteria,
            })),
    [templates]);

    return (
        <WorkingLists
            {...passOnProps}
            programId={program.id}
            templates={workingListsTemplates}
        />
    );
};
