// @flow
import { string } from 'prop-types';
import type { Icon } from '../../../../../metaData';

export type Props = {|
    title: string,
    icon?: Icon,
    description?: string,
    events: any,
    ...CssClasses,
|};
