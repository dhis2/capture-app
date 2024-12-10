// @flow
import { actions as LinkModes } from './constants';
import type { Constraint } from './RelatedStagesActions/RelatedStagesActions.types';

export type RelationshipType = {|
    fromConstraint: Constraint,
    toConstraint: Constraint,
    bidirectional: boolean,
    displayName: string,
    id: string,
    access: {
        data: {
            write: boolean,
        }
    }
|}

export type Props = {|
    programId: string,
    enrollmentId: string,
    programStageId: string,
    currentStageLabel: string,
|}
export type RelatedStageDataValueStates = {|
    linkMode: ?$Keys<typeof LinkModes>,
    scheduledAt: string,
    orgUnit: ?{
        path: string,
        id: string,
        name: string,
    },
    linkedEventId: ?string,
|}
