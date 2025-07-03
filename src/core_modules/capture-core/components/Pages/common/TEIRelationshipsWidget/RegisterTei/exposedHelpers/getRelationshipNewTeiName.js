import {
    getTrackerProgramThrowIfNotFound,
    getTrackedEntityTypeThrowIfNotFound,
} from '../../../../../../metaData';
import { convertFormToClient } from '../../../../../../converters';
import { getDisplayName } from '../../../../../../trackedEntityInstances/getDisplayName';
import { getDataEntryKey } from '../../../../../DataEntry/common/getDataEntryKey';

function getTrackerProgramMetadata(programId) {
    const program = getTrackerProgramThrowIfNotFound(programId);
    return {
        form: program.enrollment.enrollmentForm,
        attributes: program.trackedEntityType.attributes,
        tetName: program.trackedEntityType.name,
    };
}

function getTETMetadata(tetId) {
    const tet = getTrackedEntityTypeThrowIfNotFound(tetId);
    return {
        form: tet.teiRegistration.form,
        attributes: tet.attributes,
        tetName: tet.name,
    };
}

function getMetadata(programId, tetId) {
    return programId ? getTrackerProgramMetadata(programId) : getTETMetadata(tetId);
}


function getClientValuesForFormData(formValues, formFoundation) {
    const clientValues = formFoundation.convertValues(formValues, convertFormToClient);
    return clientValues;
}

export function getRelationshipNewTeiName(dataEntryId, itemId, state) {
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
