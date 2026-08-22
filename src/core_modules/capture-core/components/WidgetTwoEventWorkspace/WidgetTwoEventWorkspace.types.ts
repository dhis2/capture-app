import {
    EnrollmentPageKeys,
} from '../Pages/common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';
import { WidgetTwoEventWorkspaceWrapperTypes } from './index';
import type { ProgramStage } from '../../metaData';

export type Props = {
    programId: string;
    eventId: string;
    orgUnitId: string;
    stageId: string;
    currentPage: keyof typeof EnrollmentPageKeys | string;
    stage?: ProgramStage;
    type?: typeof WidgetTwoEventWorkspaceWrapperTypes[keyof typeof WidgetTwoEventWorkspaceWrapperTypes];
    onDeleteEvent?: (eventId: string) => void;
    onDeleteEventRelationship?: (relationshipId: string) => void;
};

export type LinkedEvent = {
    event: string;
    dataValues: { [key: string]: any };
    occurredAt: string;
    orgUnit: string;
};
