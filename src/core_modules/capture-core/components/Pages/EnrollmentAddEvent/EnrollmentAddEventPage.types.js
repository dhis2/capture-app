// @flow
import { ProgramStage } from '../../../metaData';

export type Props = {|
    programStage: ProgramStage,
    enrollmentId: string,
    programId: string,
    orgUnitId: string,
    trackedEntityName: string,
    teiDisplayName: string,
    enrollmentsAsOptions: Array<Object>,
    ...CssClasses,
|};
