// @flow
import { typeof enrollmentPageStatuses } from './EnrollmentPage.constants';

export type EnrollmentPageStatus = $Keys<enrollmentPageStatuses>

export type ContainerProps = $ReadOnly<{|
  error: boolean,
  enrollmentPageStatus: EnrollmentPageStatus,
  selectedProgramId: string,
  selectedOrgUnitId: string,
|}>

export type Props = {|
  ...ContainerProps,
  ...CssClasses
|}
