// @flow
import {
    EnrollmentPageKeys,
} from '../Pages/common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';

type PlainProps = {|
    programId: string,
    eventId: string,
    orgUnitId: string,
    stageId: string,
    currentPage: $Values<typeof EnrollmentPageKeys>,
|}

export type LinkedEvent = {|
    event: string,
    dataValues: { [string]: any },
    occurredAt: string,
    orgUnit: string,
|}

export type Props = {|
    ...PlainProps,
    ...CssClasses,
|}
