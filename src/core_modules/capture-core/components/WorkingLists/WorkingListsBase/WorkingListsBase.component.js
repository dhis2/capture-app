// @flow
import React, { memo } from 'react';
import { WorkingListsContextBuilder } from './ContextBuilder';
import type { InterfaceProps } from './workingListsBase.types';

export const WorkingListsBase = memo<InterfaceProps>((props: InterfaceProps) => (
    <WorkingListsContextBuilder
        {...props}
    />
));
