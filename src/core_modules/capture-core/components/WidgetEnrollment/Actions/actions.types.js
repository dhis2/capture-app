// @flow
import type { QueryRefetchFunction } from '@dhis2/app-runtime';

export type Props = {|
    enrollment: Object,
    refetch: QueryRefetchFunction,
|};
