// @flow
import type { ApiEvents, ApiTeis } from './types';

export const addTEIsData = (apiEvents: ApiEvents, apiTEIs: ApiTeis): ApiEvents =>
    apiEvents.map((event) => {
        const parent = apiTEIs.find(apiTEI => apiTEI.trackedEntity === event.trackedEntity);
        if (parent) {
            const parentWithOnlyOneEnrollment =
                parent?.enrollments && parent.enrollments.length > 1
                    ? {
                        ...parent,
                        enrollments: parent.enrollments.filter(
                            enrollment => enrollment.enrollment !== event.enrollment,
                        ),
                    }
                    : parent;
            return { ...event, parent: parentWithOnlyOneEnrollment };
        }
        return event;
    });
