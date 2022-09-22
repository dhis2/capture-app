// @flow
import type { QueryRefetchFunction } from '@dhis2/app-runtime';

export type Props = {|
    enrollment: Object,
    refetch: QueryRefetchFunction,
    onDelete: () => void,
    onError?: (message: string) => void,
|};

export type PlainProps = {|
    enrollment: Object,
    onUpdate: (arg: Object) => void,
    onDelete: (arg: Object) => void,
    loading: boolean,
    ...CssClasses,
|};

