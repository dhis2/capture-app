// @flow
import type {
    DataSource,
    SelectRow,
    Sort,
    SetColumnOrder,
    CustomRowMenuContents,
    UpdateFilter,
    ClearFilter,
    SelectRestMenuItem,
    ChangePage,
    ChangeRowsPerPage,
    StickyFilters,
} from '../../../../../ListView';

export type Props = $ReadOnly<{|
    updating: boolean,
    updatingWithDialog: boolean,
    dataSource?: DataSource,
    onSelectListRow: SelectRow,
    onSortList: Sort,
    onSetListColumnOrder: SetColumnOrder,
    customRowMenuContents?: CustomRowMenuContents,
    onUpdateFilter: UpdateFilter,
    onClearFilter: ClearFilter,
    onSelectRestMenuItem: SelectRestMenuItem,
    onChangePage: ChangePage,
    onChangeRowsPerPage: ChangeRowsPerPage,
    stickyFilters?: StickyFilters,
    children: React$Node,
|}>;
