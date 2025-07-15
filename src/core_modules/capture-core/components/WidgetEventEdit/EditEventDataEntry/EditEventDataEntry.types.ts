import type { WithStyles } from '@material-ui/core';
import type { RenderFoundation } from '../../../metaData';
import type { UserFormField } from '../../FormFields/UserField';

export type OrgUnit = {
    id: string;
    name: string;
    path: string;
};

export type ReduxAction<T = any, M = any> = {
    type: string;
    payload: T;
    meta?: M;
};

export type PlainProps = {
    formFoundation?: RenderFoundation | null;
    orgUnit: OrgUnit;
    programId: string;
    itemId: string;
    initialScheduleDate?: string;
    onUpdateDataEntryField: (orgUnit: OrgUnit, programId: string) => (innerAction: ReduxAction<any, any>) => void;
    onUpdateField: (orgUnit: OrgUnit, programId: string) => (innerAction: ReduxAction<any, any>) => void;
    onStartAsyncUpdateField: (orgUnit: OrgUnit, programId: string) => void;
    onSave: (orgUnit: OrgUnit) => (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void;
    onSaveAndCompleteEnrollment: (
        orgUnit: OrgUnit,
    ) => (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void;
    onHandleScheduleSave: (eventData: any) => void;
    onDelete: () => void;
    onCancel: () => void;
    onConfirmCreateNew: (itemId: string) => void;
    onCancelCreateNew: (itemId: string) => void;
    dataEntryId: string;
    onCancelEditEvent?: (isScheduled: boolean) => void;
    eventStatus?: string;
    enrollmentId: string;
    isCompleted?: boolean;
    assignee?: UserFormField | null;
    orgUnitFieldValue?: OrgUnit | null;
};

export type Props = PlainProps & WithStyles<any>;

export type State = {
    mode: string;
};

export type DataEntrySection = {
    placement: string;
    name?: string;
};
