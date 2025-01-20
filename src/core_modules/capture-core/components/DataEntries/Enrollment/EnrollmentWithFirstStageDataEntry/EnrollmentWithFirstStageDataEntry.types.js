// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import type { ProgramStage, RenderFoundation } from '../../../../metaData';

export type Props = {
    firstStageMetaData: {
        stage: ProgramStage,
    },
    formFoundation: RenderFoundation,
    orgUnit: ?OrgUnit,
};
