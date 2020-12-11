// @flow
import React, { memo } from 'react';
import { ListViewContextBuilder } from './ContextBuilder';
import type { InterfaceProps } from './types';

export const ListView = memo<InterfaceProps>(({ columns = [], ...passOnProps }: InterfaceProps) => (
  <ListViewContextBuilder {...passOnProps} columns={columns} />
));
