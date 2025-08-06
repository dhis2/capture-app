import type { WithStyles } from '@material-ui/core/styles';

export type Props = {
    programId: string,
    orgUnitId: string,
    selectedTemplateId?: string,
    onChangeTemplate?: (selectedTemplateId?: string) => void,
    onOpenBulkDataEntryPlugin: (trackedEntityIds: string[]) => void,
} & WithStyles<any>;
