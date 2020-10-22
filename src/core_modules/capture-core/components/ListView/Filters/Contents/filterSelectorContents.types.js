// @flow
import { filterTypesObject } from '../filterTypes';
import type { Options } from '../../types';
import type { FilterData } from '../../../FiltersForTypes';

type PassOnProps = $ReadOnly<{|
    id: string,
    onClose: Function,
    onUpdate: Function,
|}>;
export type Props = $ReadOnly<{|
    ...PassOnProps,
    type: $Values<typeof filterTypesObject>,
    options?: ?Options,
    classes: {
        container: string,
    },
    filterValue?: FilterData,
    multiValueFilter?: boolean,
|}>;
