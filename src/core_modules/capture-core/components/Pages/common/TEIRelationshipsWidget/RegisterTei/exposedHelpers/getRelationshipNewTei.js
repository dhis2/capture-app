// @flow
import {
    getTrackerProgramThrowIfNotFound,
    getTrackedEntityTypeThrowIfNotFound,
    type RenderFoundation,
} from '../../../../../../metaData';
import { convertFormToClient } from '../../../../../../converters';
import { getDisplayName } from '../../../../../../trackedEntityInstances/getDisplayName';
import { getDataEntryKey } from '../../../../../DataEntry/common/getDataEntryKey';

function getTrackerProgramMetadata(programId: string) {
    const program = getTrackerProgramThrowIfNotFound(programId);
    return {
        form: program.enrollment.enrollmentForm,
        attributes: program.trackedEntityType.attributes,
        tetName: program.trackedEntityType.name,
    };
}

function getTETMetadata(tetId: string) {
    const tet = getTrackedEntityTypeThrowIfNotFound(tetId);
    return {
        form: tet.teiRegistration.form,
        attributes: tet.attributes,
        tetName: tet.name,
    };
}

function getMetadata(programId: ?string, tetId: string) {
    return programId ? getTrackerProgramMetadata(programId) : getTETMetadata(tetId);
}


function getClientValuesForFormData(formValues: Object, formFoundation: RenderFoundation) {
    const clientValues = formFoundation.convertValues(formValues, convertFormToClient);
    return clientValues;
}

export function getRelationshipNewTeiName(dataEntryId: string, itemId: string, state: ReduxState) {
    const dataEntryKey = getDataEntryKey(dataEntryId, itemId);
    const formValues = state.formsValues[dataEntryKey];
    const { programId } = state.newRelationshipRegisterTei;
    const tetId = state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId;

    const { attributes: metaDataAttributes, form: formFoundation, tetName } = getMetadata(programId, tetId);
    const clientValuesForFormData = getClientValuesForFormData(formValues, formFoundation);
    const displayName = getDisplayName(clientValuesForFormData, metaDataAttributes, tetName);

    // $FlowFixM
    return displayName;
}
