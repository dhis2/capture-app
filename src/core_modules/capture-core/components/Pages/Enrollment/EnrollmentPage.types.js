// @flow
import { typeof enrollmentPageStatuses } from './EnrollmentPage.constants';

export type EnrollmentPageStatus = $Keys<enrollmentPageStatuses>

export type ContainerProps = $ReadOnly<{|
  error: boolean,
  enrollmentPageStatus: EnrollmentPageStatus,
  programId: string,
  orgUnitId: string,
  enrollmentId: string,
  trackedEntityName: string,
  teiDisplayName: string,
  enrollmentsAsOptions: Array<Object>,
|}>

export type Props = {|
  ...ContainerProps,
  ...CssClasses
|}
