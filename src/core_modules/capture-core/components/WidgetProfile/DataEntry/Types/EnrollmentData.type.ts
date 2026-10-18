import type { Geometry } from '../helpers/types';

export type EnrollmentData = {
    enrollment: string;
    enrolledAt: string;
    occurredAt: string;
    status: string;
    geometry?: Geometry;
};
