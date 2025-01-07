// @flow
import {
    EnrollmentPageKeys,
} from '../Pages/common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';
import { WidgetTwoEventWorkspaceWrapperTypes } from './index';
import type { ProgramStage } from '../../metaData';

export type Props = {|
    programId: string,
    eventId: string,
    orgUnitId: string,
    stageId: string,
    currentPage: $Values<typeof EnrollmentPageKeys> | string,
    stage?: ProgramStage,
    type?: $Values<typeof WidgetTwoEventWorkspaceWrapperTypes>,
|}

export type LinkedEvent = {|
    event: string,
    dataValues: { [string]: any },
    occurredAt: string,
    orgUnit: string,
|}
