import type { Theme } from '@material-ui/core/styles';
import type { RenderFoundation, ProgramStage } from '../../../metaData';
import type { AddEventSaveType } from './addEventSaveTypes';

export type OrgUnit = {
    id: string;
    name: string;
    path: string;
};

export type PlainProps = {
    id: string;
    orgUnitId: string;
    programId: string;
    stage: ProgramStage;
    formFoundation: RenderFoundation;
    onUpdateField: (innerAction: any) => void;
    onStartAsyncUpdateField: any;
    onSetSaveTypes: (saveTypes: AddEventSaveType[] | null) => void;
    onSave?: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation, completed?: boolean) => void;
    onAddNote: (itemId: string, dataEntryId: string, note: string) => void;
    onScrollToRelationships?: () => void;
    theme: Theme;
    formHorizontal?: boolean;
    recentlyAddedRelationshipId?: string | null;
    placementDomNodeForSavingText?: HTMLElement;
    programName: string;
    orgUnitFieldValue?: OrgUnit | null;
};

export type DataEntrySection = {
    placement: string;
    name: string;
};
