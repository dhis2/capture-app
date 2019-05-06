// @flow
import * as React from 'react';
import EventContentMenu from './EventContentMenu.component';

export default () => ({
    getCellBody: (row: {eventId: string, [elementId: string]: any}, props: Object) => (<EventContentMenu row={row} {...props} />),
    headerCellStyle: { width: 96 },
})
;
