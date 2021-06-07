// @flow
import type { Event } from '../../../types/common.types';

export type Props = {|
    events: Array<Event>,
    data: any,
    ...CssClasses,
|};

