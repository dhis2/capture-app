// @flow
import type { Icon } from '../../../../../metaData';

export type Props = {|
    title: string,
    icon?: Icon,
    description?: string,
    events: any[],
    ...CssClasses,
|};
