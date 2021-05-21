// @flow
import type { QueryRefetchFunction } from '@dhis2/app-runtime';

export type Props = {|
    enrollment: Object,
    refetch: QueryRefetchFunction,
    callbackDelete: () => void,
|};

export type PlainProps = {|
    enrollment: Object,
    updateAction: (arg: Object) => void,
    deleteAction: (arg: Object) => void,
    ...CssClasses,
|};

