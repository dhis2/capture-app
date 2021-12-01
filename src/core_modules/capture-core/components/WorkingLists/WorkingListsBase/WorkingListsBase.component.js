// @flow
import React, { memo } from 'react';
import type { InterfaceProps } from './workingListsBase.types';
import { WorkingListsContextBuilder } from './ContextBuilder';

export const WorkingListsBase = memo<InterfaceProps>((props: InterfaceProps) => (
    <WorkingListsContextBuilder
        {...props}
    />
));
