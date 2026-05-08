import {
    useEnrollmentAccessContext,
    useShouldShowWidgetAccessBadge,
} from '../Pages/common/EnrollmentOverviewDomain/EnrollmentAccessContext';
import type { NoteScope } from './WidgetNote.types';

type Result = {
    readOnly: boolean;
    showBadge: boolean;
    programWriteAccess: boolean;
    programStageWriteAccess: boolean;
    trackedEntityTypeName?: string;
};

export const useWidgetNoteAccess = (scope: NoteScope): Result => {
    const {
        programWriteAccess,
        currentStageWriteAccess,
        trackedEntityTypeName,
    } = useEnrollmentAccessContext();
    const showBadge = useShouldShowWidgetAccessBadge();
    const isEventScope = scope === 'event';
    return {
        readOnly: isEventScope ? !currentStageWriteAccess : !programWriteAccess,
        showBadge,
        programWriteAccess: isEventScope ? true : programWriteAccess,
        programStageWriteAccess: isEventScope ? currentStageWriteAccess : true,
        trackedEntityTypeName,
    };
};
