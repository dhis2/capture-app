// @flow
import type { FilterData, Options } from '../../../FiltersForTypes';
import { typeof filterTypesObject } from '../filters.const';

type PassOnProps = $ReadOnly<{|
    id: string,
    onClose: Function,
    onUpdate: Function,
|}>;
export type Props = $ReadOnly<{|
    ...PassOnProps,
    type: $Values<filterTypesObject>,
    options?: ?Options,
    classes: {
        container: string,
    },
    filterValue?: FilterData,
    multiValueFilter?: boolean,
|}>;
