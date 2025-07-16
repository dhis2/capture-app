import React, { memo } from 'react';
import { ListPaginationContextConsumer } from './ListPaginationContextConsumer.component';

type Props = { disabled?: boolean; };

export const ListPagination = memo<Props>((props: Props) => (
    <ListPaginationContextConsumer
        {...props}
    />
));
