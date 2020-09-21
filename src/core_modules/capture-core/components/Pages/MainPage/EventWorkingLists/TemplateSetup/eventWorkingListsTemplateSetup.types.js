// @flow
import type { EventProgram } from '../../../../../metaData';
import type { FiltersData, ColumnConfigs } from '../../WorkingLists';

export type Props = $ReadOnly<{
    filters?: FiltersData,
    columns: ColumnConfigs,
    sortById?: string,
    sortByDirection?: string,
    program: EventProgram,
    onAddTemplate: Function,
    onUpdateTemplate: Function,
    onDeleteTemplate: Function,
}>;
