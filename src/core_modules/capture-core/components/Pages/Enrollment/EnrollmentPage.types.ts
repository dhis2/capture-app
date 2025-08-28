import type { enrollmentPageStatuses } from './EnrollmentPage.constants';

export type EnrollmentPageStatus = keyof typeof enrollmentPageStatuses;

export type ContainerProps = Readonly<{
  error: boolean;
  enrollmentPageStatus: EnrollmentPageStatus;
  programId: string;
  orgUnitId: string;
  enrollmentId: string;
  trackedEntityName: string;
  teiDisplayName: string;
  enrollmentsAsOptions: Array<Record<string, unknown>>;
}>;

export type Props = ContainerProps;
