// @flow
import React, { memo } from 'react';
import { ListPaginationContextConsumer } from './ListPaginationContextConsumer.component';

type Props = $ReadOnly<{}>;

export const ListPagination = memo<Props>((props: Props) => (
  <ListPaginationContextConsumer {...props} />
));
