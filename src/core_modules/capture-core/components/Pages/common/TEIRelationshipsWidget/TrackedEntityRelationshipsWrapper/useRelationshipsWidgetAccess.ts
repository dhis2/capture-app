import {
    useEnrollmentAccessContext,
    useShouldShowWidgetAccessBadge,
} from '../../EnrollmentOverviewDomain/EnrollmentAccessContext';

type Result = {
    readOnly: boolean;
    accessReadOnly: boolean;
    hideButton: boolean;
    hideReadOnlyBadge: boolean;
};

export const useRelationshipsWidgetAccess = (readOnlyMode?: boolean): Result => {
    const { trackedEntityTypeWriteAccess, allWriteAccessMissing } = useEnrollmentAccessContext();
    const showBadge = useShouldShowWidgetAccessBadge();
    const accessReadOnly = !trackedEntityTypeWriteAccess;
    return {
        readOnly: Boolean(readOnlyMode) || accessReadOnly,
        accessReadOnly,
        hideButton: accessReadOnly || allWriteAccessMissing,
        hideReadOnlyBadge: !showBadge,
    };
};
