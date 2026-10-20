export type EnrollmentData = {
    enrollment: string;
    enrolledAt: string;
    occurredAt: string;
    status: string;
    geometry?: { type: string; coordinates: any } | null;
};
