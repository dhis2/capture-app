// @flow
import type { EventProgram } from '../../../../../metaData';

export type Props = $ReadOnly<{
    downloadRequest: { url: string, queryParams: ?Object },
    program: EventProgram,
}>;
