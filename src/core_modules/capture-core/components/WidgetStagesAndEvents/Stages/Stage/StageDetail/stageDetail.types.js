// @flow
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import type { apiDataElement } from 'capture-core/metaDataStoreLoaders/programs/quickStoreOperations/types';

export type Props = {|
    events: Array<ApiTEIEvent>,
    data: Array<apiDataElement>,
    eventName: string,
    ...CssClasses,
|};

