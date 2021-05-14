// @flow
import type { FetchError } from '@dhis2/app-runtime';

export type Props = {|
    enrollment: Object,
    program: Object,
    ownerOrgUnit: Object,
    error?: FetchError,
    loading: boolean,
    ...CssClasses,
|};
