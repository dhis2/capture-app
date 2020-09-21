// @flow
import React, { memo } from 'react';
import WorkingListsContextBuilder from './WorkingListsContextBuilder.component';
import type { InterfaceProps } from './workingLists.types';

export const WorkingLists = memo<InterfaceProps>((props: InterfaceProps) => (
    <WorkingListsContextBuilder
        {...props}
    />
));
