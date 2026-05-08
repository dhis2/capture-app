import {
    useEnrollmentAccessContext,
    useShouldShowWidgetAccessBadge,
} from '../Pages/common/EnrollmentOverviewDomain/EnrollmentAccessContext';

type Result = {
    readOnly: boolean;
    showBadge: boolean;
    programWriteAccess: boolean;
};

export const useWidgetEnrollmentAccess = (readOnlyMode: boolean): Result => {
    const { programWriteAccess } = useEnrollmentAccessContext();
    const showBadge = useShouldShowWidgetAccessBadge();
    return {
        readOnly: readOnlyMode || !programWriteAccess,
        showBadge,
        programWriteAccess,
    };
};
