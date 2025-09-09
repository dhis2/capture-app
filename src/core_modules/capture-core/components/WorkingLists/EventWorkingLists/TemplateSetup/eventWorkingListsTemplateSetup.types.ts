import type { EventProgram } from '../../../../metaData';
import type {
    FiltersData,
    AddTemplate,
    UpdateTemplate,
    DeleteTemplate,
    WorkingListTemplates,
} from '../../WorkingListsBase';
import type { EventWorkingListsColumnConfigs } from '../../EventWorkingListsCommon';
import type { EventWorkingListsTemplates } from '../types';
import type { EventWorkingListsDataSourceSetupOutputProps } from '../DataSourceSetup';

type ExtractedProps = {
    filters?: FiltersData,
    columns: EventWorkingListsColumnConfigs,
    sortById?: string,
    sortByDirection?: string,
    program: EventProgram,
    onAddTemplate: any,
    onUpdateTemplate: any,
    onDeleteTemplate: any,
    templates?: EventWorkingListsTemplates,
};

type RestProps = Omit<EventWorkingListsDataSourceSetupOutputProps, keyof ExtractedProps>;

export type Props = RestProps & ExtractedProps;

export type EventWorkingListsTemplateSetupOutputProps = RestProps & {
    filters?: FiltersData,
    columns: EventWorkingListsColumnConfigs,
    sortById?: string,
    sortByDirection?: string,
    program: EventProgram,
    onAddTemplate: AddTemplate,
    onUpdateTemplate: UpdateTemplate,
    onDeleteTemplate: DeleteTemplate,
    templates?: WorkingListTemplates,
    templateSharingType: string,
};
