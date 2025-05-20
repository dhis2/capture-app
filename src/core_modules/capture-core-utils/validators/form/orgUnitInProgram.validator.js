import { getUserStorageController } from '../../../capture-core/storageControllers';
import { userStores } from '../../../capture-core/storageControllers/stores';

/**
 * Validates if an org unit belongs to a program
 * @export
 * @param {Object} value - The org unit value
 * @param {Object} props - The props containing programId
 * @returns {boolean}
 */

type OrgUnitValue = {
    id: string,
    name: string,
    path: string,
}

export const isValidOrgUnitInProgram = (
    value: ?OrgUnitValue,
    props: Object,
) => {
    if (!value?.id) {
        return false;
    }

    const programId = props?.programId;
    
    if (!programId) {
        return true;
    }

    const programData = getUserStorageController()
        .get(userStores.ORGANISATION_UNITS_BY_PROGRAM, programId);

    if (programData?.organisationUnits) {
        return !!programData.organisationUnits[value.id];
    }

    return true;
};
