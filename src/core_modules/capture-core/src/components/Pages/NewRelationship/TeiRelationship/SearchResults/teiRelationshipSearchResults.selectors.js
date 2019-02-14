// @flow
import { createSelector } from 'reselect';
import { trackedEntityTypesCollection, programCollection } from '../../../../../metaDataMemoryStores';
import chunk from '../../../../../utils/chunk';

const trackedEntityTypeIdSelector = props => props.selectedTrackedEntityTypeId;
const programIdSelector = props => props.selectedProgramId;

const makeAttributesSelector = () => createSelector(
    programIdSelector,
    trackedEntityTypeIdSelector,
    (programId: ?string, trackedEntityTypeId: string) => {
        if (programId) {
            const program = programCollection.get(programId);
            // $FlowFixMe
            return program.attributes.filter(a => a.displayInReports);
        }
        const tet = trackedEntityTypesCollection.get(trackedEntityTypeId);
        // $FlowFixMe
        return tet.attributes.filter(a => a.displayInReports);
    },
);

export const makeAttributesContainerSelector = () => {
    const attributesSelector = makeAttributesSelector();
    return createSelector(
        attributesSelector,
        (attributes) => {
            const tempAttributes = [...attributes];
            const profilePicture = tempAttributes.find(a => a.type === 'IMAGE');
            if (profilePicture) {
                tempAttributes.splice(tempAttributes.indexOf(profilePicture), 1);
            }
            return {
                attributeChunks: chunk(tempAttributes, 5),
                profilePictureAttribute: profilePicture,
            };
        },
    );
};

