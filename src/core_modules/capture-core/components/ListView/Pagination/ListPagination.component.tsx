import React, { memo } from 'react';
import { ListPaginationContextConsumer } from './ListPaginationContextConsumer.component';

type Props = Record<string, never>;

export const ListPagination = memo<Props>((props: Props) => (
    <ListPaginationContextConsumer
        {...props}
    />
));
