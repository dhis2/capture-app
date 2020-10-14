// @flow
import { type OptionSet, dataElementTypes } from '../../../../metaData';
import type {
    CustomMenuContents,
    CustomRowMenuContents,
    FiltersData,
    StickyFilters,
    ChangePage,
    ChangeRowsPerPage,
    ClearFilter,
    UpdateFilter,
    SelectRestMenuItem,
    SetColumnOrder,
    SelectRow,
    Sort,
} from '../../../ListView';

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
    nextEventQueryCriteria?: Object,
    deleted?: boolean,
    skipInitDuringAddProcedure?: boolean,
|};

export type WorkingListTemplates = Array<WorkingListTemplate>;

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
    onCancelUpdateList?: Function,
    lastIdDeleted?: string,
};

export type LoadedContext = {
    programIdTemplates?: string,
    programIdView?: string,
    orgUnitId?: string,
    categories?: Object,
};

export type Categories = { [id: string]: string };

export type AddTemplate = (name: string, template: WorkingListTemplate) => void;
export type CancelLoadView = () => void;
export type CancelLoadTemplates = () => void;
export type CancelUpdateList = () => void;
export type DeleteTemplate = (template: WorkingListTemplate) => void;
export type LoadView = (
    template: WorkingListTemplate,
    meta: { programId: string, orgUnitId: string, categories: Categories, lastTransaction: number }) => void;
export type LoadTemplates = (programId: string) => void;
export type SelectTemplate = (templateId: string) => void;
export type UnloadingContext = () => void;
export type UpdateTemplate = (template: WorkingListTemplate) => void;
export type UpdateList = (data: {
    filters?: FiltersData,
    sortById?: string,
    sortByDirection?: string,
    currentPage: number,
    rowsPerPage: number,
    programId: string,
    orgUnitId: string,
    categories?: Categories,
    lastIdDeleted?: string,
}) => void;

export type InterfaceProps = $ReadOnly<{|
    categories?: Categories,
    columns: ColumnConfigs,
    currentPage?: number,
    currentTemplate?: WorkingListTemplate,
    currentViewHasTemplateChanges?: boolean,
    customListViewMenuContents?: CustomMenuContents,
    customRowMenuContents?: CustomRowMenuContents,
    dataSource?: DataSource,
    filters?: FiltersData,
    lastIdDeleted?: string, // TODO: Dealing with this in next PR
    lastTransaction: number, // TODO: Dealing with this in next PR
    loadedContext?: LoadedContext,
    loading: boolean,
    loadViewError?: string,
    loadTemplatesError?: string, // TODO: Check
    onAddTemplate: AddTemplate,
    onCancelLoadView?: CancelLoadView,
    onCancelLoadTemplates?: CancelLoadTemplates,
    onCancelUpdateList?: CancelUpdateList,
    onChangePage: ChangePage,
    onChangeRowsPerPage: ChangeRowsPerPage,
    onCheckSkipReload: Function, // TODO: Dealing with this in next PR
    onCleanSkipInitAddingTemplate: Function, // TODO: Dealing with this in next PR
    onClearFilter: ClearFilter,
    onDeleteTemplate: DeleteTemplate,
    onLoadView: LoadView,
    onLoadTemplates: LoadTemplates,
    onUpdateFilter: UpdateFilter,
    onSelectListRow: SelectRow,
    onSelectRestMenuItem: SelectRestMenuItem,
    onSelectTemplate: SelectTemplate,
    onSetListColumnOrder: SetColumnOrder,
    onSortList: Sort,
    onUnloadingContext?: UnloadingContext,
    onUpdateList: UpdateList,
    onUpdateTemplate: UpdateTemplate,
    orgUnitId: string,
    programId: string,
    recordsOrder?: Array<string>, // TODO: Dealing with this in later PR
    rowIdKey: string,
    rowsCount?: number,
    rowsPerPage?: number,
    sortByDirection?: string,
    sortById?: string,
    stickyFilters?: StickyFilters,
    templates?: WorkingListTemplates,
    templatesLoading: boolean,
    updating: boolean,
    updatingWithDialog: boolean,
|}>;

export type WorkingListsOutputProps = $ReadOnly<{|
    ...InterfaceProps,
|}>;
