// @flow
import type { Icon } from '../../../../../metaData';

export type Props = {|
    title: string,
    events: Array<ApiEnrollmentEvent>,
    icon?: Icon,
    description?: ?string,
    ...CssClasses,
|};
