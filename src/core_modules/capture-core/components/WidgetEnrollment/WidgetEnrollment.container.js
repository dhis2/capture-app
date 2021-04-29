// @flow
import { WidgetEnrollment } from './WidgetEnrollment.component';
import { withOrganizationUnit } from './HOC/withOrganizationUnit';
import { withTrackedEntityInstances } from './HOC/withTrackedEntityInstances';
import { withEnrollment } from './HOC/withEnrollment';
import { withProgram } from './HOC/withProgram';

export const WidgetEnrollmentContainer = withProgram(
    withEnrollment(withTrackedEntityInstances(withOrganizationUnit(WidgetEnrollment))),
);
