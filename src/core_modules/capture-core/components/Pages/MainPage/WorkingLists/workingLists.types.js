// @flow
import { type OptionSet, dataElementTypes } from '../../../../metaData';
import type { CustomMenuContents, CustomRowMenuContents, FiltersData, StickyFilters } from '../../../ListView';

export type WorkingListTemplate = {|
    id: string,
    isDefault?: ?boolean,
    name: string,
    displayName: string,
    filters: Object,
    access: {
        read: boolean,
        update: boolean,
        delete: boolean,
        write: boolean,
        manage: boolean,
    },
    notPreserved?: ?boolean,
|};

type ColumnConfigBase = {|
    id: string,
    visible: boolean,
    type: $Values<typeof dataElementTypes>,
    header: string,
|};
export type MetadataColumnConfig = {|
    ...ColumnConfigBase,
    optionSet?: ?OptionSet,
|};

export type MainColumnConfig = {|
    ...ColumnConfigBase,
    isMainProperty: true,
    options?: ?Array<{text: string, value: any}>,
    singleSelect?: boolean,
    apiName?: string,
|};

export type ColumnConfig = MetadataColumnConfig | MainColumnConfig;

export type ColumnConfigs = Array<ColumnConfig>;

export type DataSource = { [id: string]: Object };

export type ColumnOrder = Array<{ id: string, visible: boolean }>;

export type ListViewUpdaterContextData = {
    currentPage?: number,
    rowsPerPage?: number,
};

export type InterfaceProps = $ReadOnly<{|
    categories?: Object,
    columns: ColumnConfigs,
    currentPage?: number,
    currentTemplate?: WorkingListTemplate,
    currentViewHasTemplateChanges?: boolean,
    customListViewMenuContents?: CustomMenuContents,
    customRowMenuContents?: CustomRowMenuContents,
    dataSource: DataSource,
    filters?: FiltersData,
    isLoading: boolean,
    isUpdating: boolean,
    isUpdatingWithDialog: boolean,
    lastEventIdDeleted?: string,
    lastTransaction: number,
    listContext: Object,
    loadEventListError?: string,
    loadTemplatesError?: string,
    onAddTemplate: Function,
    onCancelLoadEventList: Function,
    onCancelLoadTemplates: Function,
    onCancelUpdateEventList: Function,
    onChangePage: Function,
    onChangeRowsPerPage: Function,
    onCheckSkipReload: Function, // TODO: Break this down
    onCleanSkipInitAddingTemplate: Function, // TODO: Break this down
    onClearFilter: Function,
    onDeleteTemplate: Function,
    onFilterUpdate: Function,
    onListRowSelect: Function,
    onLoadEventList: Function,
    onLoadTemplates: Function,
    onRestMenuItemSelected: Function,
    onSelectTemplate: Function,
    onSetListColumnOrder: Function,
    onSortList: Function,
    onUnloadingContext: Function,
    onUpdateTemplate: Function,
    orgUnitId: string,
    programId: string,
    recordsOrder?: Array<string>,
    rowIdKey: string,
    rowsCount?: number,
    rowsPerPage?: number,
    sortByDirection?: string,
    sortById?: string,
    stickyFilters?: StickyFilters,
    templates?: Array<WorkingListTemplate>,
    templatesAreLoading: boolean,
    templatesForPogramId: string, // TODO: Break this down
|}>;
