// @flow
import React from 'react';
import { WorkingLists } from '../../WorkingLists';
import type { Props } from './workingListsInterfaceBuilder.types';

export const WorkingListsInterfaceBuilder = ({ program, ...passOnProps }: Props) => (
    <WorkingLists
        {...passOnProps}
        programId={program.id}
    />
);
