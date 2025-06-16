// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { ProgramStage } from '../../../metaData';

export type PlainProps = {|
    eventStatus?: string,
    stage: ProgramStage,
    programId: string,
    orgUnit: OrgUnit,
    setChangeLogIsOpen: (toggle: boolean) => void,
    eventDate: string,
|};

export type Props = {|
    ...PlainProps,
    ...CssClasses,
|};
