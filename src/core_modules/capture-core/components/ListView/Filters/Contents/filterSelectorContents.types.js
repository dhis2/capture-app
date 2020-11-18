// @flow
import { filterTypesObject } from '../filters.const';
import type { FilterData, Options } from '../../../FiltersForTypes';

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
