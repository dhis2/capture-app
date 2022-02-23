// @flow
import type { QueryRefetchFunction } from '@dhis2/app-runtime';

export type Props = {|
    enrollment: Object,
    refetch: QueryRefetchFunction,
    onDelete: () => void,
    onAddNew: () => void,
    onlyEnrollOnce: boolean,
    tetId: string,
|};

export type PlainProps = {|
    enrollment: Object,
    onUpdate: (arg: Object) => void,
    onDelete: (arg: Object) => void,
    onAddNew: (arg: Object) => void,
    loading: boolean,
    onlyEnrollOnce: boolean,
    tetId: string,
    ...CssClasses,
|};

