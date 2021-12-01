// @flow
import React, { memo } from 'react';
import type { InterfaceProps } from './types';
import { ListViewContextBuilder } from './ContextBuilder';

export const ListView = memo<InterfaceProps>(({ columns = [], ...passOnProps }: InterfaceProps) => (
    <ListViewContextBuilder
        {...passOnProps}
        columns={columns}
    />
));
