// @flow
import { EnrollmentPageKeys }
    from '../../Pages/common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';
import type { ProgramStage } from '../../../metaData';
import { WidgetTwoEventWorkspaceWrapperTypes } from '../index';

export type PlainProps = {|
    orgUnitId: string,
    linkedEvent: { event: string },
    stage: ProgramStage,
    currentPage: $Values<typeof EnrollmentPageKeys> | string,
    type?: $Values<typeof WidgetTwoEventWorkspaceWrapperTypes>,
|};

export type Props = {|
    ...PlainProps,
    ...CssClasses,
|};

