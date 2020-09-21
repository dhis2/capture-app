// @flow
import React, { memo } from 'react';
import { ListViewContextProvider } from './ContextProvider';
import type { InterfaceProps } from './types';

export const ListView = memo<InterfaceProps>(({ columns = [], ...passOnProps }: InterfaceProps) => (
    <ListViewContextProvider
        {...passOnProps}
        columns={columns}
    />
));
