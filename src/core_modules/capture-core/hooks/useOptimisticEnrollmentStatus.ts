import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
    updateEnrollmentAndEvents,
    commitEnrollmentAndEvents,
    rollbackEnrollmentAndEvents,
    showEnrollmentError,
} from '../components/Pages/common/EnrollmentOverviewDomain';
import { useNavigate } from '../utils/routing';

type Options = {
    // Where to navigate when the widget reports success with `redirect: true`, for pages that
    // cannot stay put once the status changed. Pages that stay put omit it.
    redirectUrl?: string;
};

// Shared optimistic-update handlers for the enrollmentDomain enrollment slice - the counterpart to
// useOptimisticEventStatus, which does the same for the event slice. WidgetEnrollment applies the
// new status immediately, then these commit it or roll the whole enrollment back on failure.
export const useOptimisticEnrollmentStatus = (options?: Options) => {
    const dispatch = useDispatch();
    const { navigate } = useNavigate();
    const { redirectUrl } = options ?? {};

    const onUpdateEnrollmentStatus = useCallback((enrollment: Record<string, unknown>) => {
        dispatch(updateEnrollmentAndEvents(enrollment));
    }, [dispatch]);

    const onUpdateEnrollmentStatusError = useCallback((message: string) => {
        dispatch(rollbackEnrollmentAndEvents());
        dispatch(showEnrollmentError({ message }));
    }, [dispatch]);

    const onUpdateEnrollmentStatusSuccess = useCallback(({ redirect }: { redirect?: boolean } = {}) => {
        dispatch(commitEnrollmentAndEvents());
        if (redirect && redirectUrl) {
            navigate(redirectUrl);
        }
    }, [dispatch, navigate, redirectUrl]);

    return {
        onUpdateEnrollmentStatus,
        onUpdateEnrollmentStatusError,
        onUpdateEnrollmentStatusSuccess,
    };
};
