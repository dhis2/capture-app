// @flow
import type { EventProgram } from '../../../../../metaData';

export type PassOnProps = $ReadOnly<{
    listId: string,
    eventsDataElementValues: Object,
    eventsMainProperties: Object,
}>;

export type Props = $ReadOnly<{
    ...PassOnProps,
    program: EventProgram,
    customColumnOrder?: Array<{ id: string, visible: boolean }>,
    onLoadView: Function,
    onUpdateList: Function,
}>;
