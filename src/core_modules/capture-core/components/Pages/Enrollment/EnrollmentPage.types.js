// @flow
import { typeof enrollmentPageStatuses } from './EnrollmentPage.constants';

export type EnrollmentPageStatus = $Keys<enrollmentPageStatuses>

export type ContainerProps = $ReadOnly<{|
  enrollmentPageStatus: EnrollmentPageStatus,
|}>

export type Props = {|
  ...ContainerProps,
  ...CssClasses
|}
