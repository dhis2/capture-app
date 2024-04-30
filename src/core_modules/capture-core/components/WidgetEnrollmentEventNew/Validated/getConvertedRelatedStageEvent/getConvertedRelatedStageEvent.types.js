// @flow
import type { RelatedStageDataValueStates } from '../../../WidgetRelatedStages';
import { actions as LinkModes } from '../../../WidgetRelatedStages/constants';
import type { RequestEvent } from '../validated.types';

type RelatedStageType = {|
    id: string,
    fromConstraint: {|
        programStage: {
            id: string,
        },
    |},
    toConstraint: {
        programStage: {
            id: string,
        },
    }
|}

export type ConvertedRelatedStageEventProps = {|
    linkMode: $Keys<typeof LinkModes>,
    relatedStageDataValues: RelatedStageDataValueStates,
    programId: string,
    teiId: string,
    currentProgramStageId: string,
    enrollmentId: string,
    relatedStageType: RelatedStageType,
    clientRequestEvent: RequestEvent,
|}
