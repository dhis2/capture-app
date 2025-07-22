import { createSelector } from 'reselect';
import { programCollection } from '../../../../../metaDataMemoryStores/programCollection/programCollection';

const programIdSelector = (state: any) => state.currentSelections.programId;

export const makeProgramNameSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        const program = programCollection.get(programId);
        const programName = (program && program.name) || '';
        return programName;
    },
);

const stageSelector = (props: any) => props.stage;

export const makeWritableRelationshipTypesSelector = () => createSelector(
    stageSelector,
    (stage: any) => (stage ? stage.relationshipTypesWhereStageIsFrom.filter((r: any) => r.access.data.write) : []),
);
