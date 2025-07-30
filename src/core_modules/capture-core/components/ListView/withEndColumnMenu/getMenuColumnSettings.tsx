import * as React from 'react';
import { RowMenu } from './RowMenu.component';

export const getMenuColumnSettings = () => ({
    getCellBody: (row: {eventId: string, [elementId: string]: any}, props: any) => (<RowMenu row={row} {...props} />),
    headerCellStyle: { width: 96 },
});
