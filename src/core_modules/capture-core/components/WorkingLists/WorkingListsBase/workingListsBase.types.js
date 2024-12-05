// @flow
import { typeof dataElementTypes } from '../../../metaData';
import type {
    CustomMenuContents,
    CustomRowMenuContents,
    DataSource,
    FiltersData,
    FiltersOnly,
    AdditionalFilters,
    StickyFilters,
    ChangePage,
    ChangeRowsPerPage,
    ClearFilter,
    RemoveFilter,
    UpdateFilter,
    SelectRestMenuItem,
    SetColumnOrder,
    SelectRow,
    Sort,
} from '../../ListView';

export type WorkingListTemplate = {
    id: string,
    isDefault?: ?boolean,
    name: string,
    access: {
        update: boolean,
        delete: boolean,
        write: boolean,
        manage: boolean,
    },
    notPreserved?: boolean,
    updating?: boolean,
    deleted?: boolean,
    order?: number,
};

export type WorkingListTemplates = Array<WorkingListTemplate>;

export type ColumnConfig = {
    id: string,
    visible: boolean,
    type: $Values<dataElementTypes>,
    header: string,
    options?: ?Array<{text: string, value: any}>,
    multiValueFilter?: boolean,
    filterHidden?: boolean,
    additionalColumn?: boolean,
};

export type ColumnConfigs = Array<ColumnConfig>;

export type ColumnOrder = Array<{ id: string, visible: boolean }>;

export type LoadedContext = {|
    programIdTemplates?: string,
    programIdView?: string,
    programStageId?: string,
    orgUnitId?: string,
    categories?: Object,
|};

export type LoadedViewContext = {|
    programId?: string,
    orgUnitId?: string,
    categories?: Object,
|};

export type Categories = { [id: string]: string };

export type AddTemplate = (name: string) => void;
export type CancelLoadView = () => void;
export type CancelLoadTemplates = () => void;
export type CancelUpdateList = () => void;
export type DeleteTemplate = (template: WorkingListTemplate) => void;
export type LoadView = (
    template: WorkingListTemplate,
    meta: {|
        programId: string,
        orgUnitId: string,
        categories?: Categories,
        programStageId?: string,
    |}) => void;
export type LoadTemplates = (programId: string) => void;
export type SelectTemplate = (templateId: string, programStageId?: ?string) => void;
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
    resetMode: boolean,
}) => void;

export type ManagerContextData = {|
    currentTemplate?: WorkingListTemplate,
    onSelectTemplate: SelectTemplate,
|};

export type ListViewConfigContextData = {|
    currentViewHasTemplateChanges?: boolean,
    onAddTemplate?: AddTemplate,
    onUpdateTemplate?: UpdateTemplate,
    onDeleteTemplate?: DeleteTemplate,
|};

export type ListViewLoaderContextData = {|
    sortById?: string,
    sortByDirection?: string,
    filters?: FiltersData,
    columns: ColumnConfigs,
    loading: boolean,
    onLoadView: LoadView,
    loadViewError?: string,
    onUpdateList: UpdateList,
    onCancelLoadView?: CancelLoadView,
    orgUnitId: string,
    categories?: Categories,
    dirtyView: boolean,
    loadedViewContext: LoadedViewContext,
    viewPreloaded?: boolean,
|};

export type ListViewUpdaterContextData = {|
    currentPage?: number,
    rowsPerPage?: number,
    onCancelUpdateList?: Function,
    customUpdateTrigger?: any,
    forceUpdateOnMount?: boolean,
    dirtyList: boolean,
    loadedOrgUnitId?: string,
|};

export type ListViewBuilderContextData = {|
    updating: boolean,
    updatingWithDialog: boolean,
    dataSource?: DataSource,
    onSelectListRow: SelectRow,
    onSortList: Sort,
    onSetListColumnOrder: SetColumnOrder,
    customRowMenuContents?: CustomRowMenuContents,
    onUpdateFilter: UpdateFilter,
    onClearFilter: ClearFilter,
    onRemoveFilter: RemoveFilter,
    onSelectRestMenuItem: SelectRestMenuItem,
    onChangePage: ChangePage,
    onChangeRowsPerPage: ChangeRowsPerPage,
    stickyFilters?: StickyFilters,
    programStageId?: string,
|};

export type SharingSettings = {|
    externalAccess: boolean,
    publicAccess: string,
    userAccesses: Array<{
        id: string,
        name: string,
        access: string,
    }>,
    userGroupAccesses: Array<{
        id: string,
        name: string,
        access: string,
    }>,
|};
export type SetTemplateSharingSettings = (sharingSettings: SharingSettings, templateId: string) => void;

export type InterfaceProps = $ReadOnly<{|
    categories?: Categories,
    columns: ColumnConfigs,
    currentPage?: number,
    currentTemplate?: WorkingListTemplate,
    currentViewHasTemplateChanges?: boolean,
    customListViewMenuContents?: CustomMenuContents,
    customRowMenuContents?: CustomRowMenuContents,
    customUpdateTrigger?: any,
    dataSource?: DataSource,
    filters?: FiltersData,
    filtersOnly?: FiltersOnly,
    additionalFilters?: AdditionalFilters,
    forceUpdateOnMount?: boolean,
    loadedContext?: LoadedContext,
    loading: boolean,
    loadViewError?: string,
    loadTemplatesError?: string,
    onAddTemplate?: AddTemplate,
    onCancelLoadView?: CancelLoadView,
    onCancelLoadTemplates?: CancelLoadTemplates,
    onCancelUpdateList?: CancelUpdateList,
    onChangePage: ChangePage,
    onChangeRowsPerPage: ChangeRowsPerPage,
    onClearFilter: ClearFilter,
    onRemoveFilter: RemoveFilter,
    onDeleteTemplate?: DeleteTemplate,
    onLoadView: LoadView,
    onLoadTemplates: LoadTemplates,
    onSelectListRow: SelectRow,
    onSelectRestMenuItem: SelectRestMenuItem,
    onSelectTemplate: SelectTemplate,
    onSetListColumnOrder: SetColumnOrder,
    onSetTemplateSharingSettings?: SetTemplateSharingSettings,
    onSortList: Sort,
    onUnloadingContext?: UnloadingContext,
    onUpdateFilter: UpdateFilter,
    onUpdateList: UpdateList,
    onUpdateTemplate?: UpdateTemplate,
    orgUnitId: string,
    programId: string,
    rowIdKey: string,
    rowsPerPage?: number,
    sortByDirection?: string,
    sortById?: string,
    stickyFilters?: StickyFilters,
    templates?: WorkingListTemplates,
    templatesLoading: boolean,
    updating: boolean,
    updatingWithDialog: boolean,
    viewPreloaded?: boolean,
    programStageId?: string,
    templateSharingType: string,
|}>;

export type WorkingListsOutputProps = InterfaceProps;
