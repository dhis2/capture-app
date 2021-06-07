// @flow
import type { Icon } from '../../../../../metaData';
import type { Event } from '../../../types/common.types';

export type Props = {|
    title: string,
    icon?: Icon,
    description?: string,
    events: Array<Event>,
    ...CssClasses,
|};
