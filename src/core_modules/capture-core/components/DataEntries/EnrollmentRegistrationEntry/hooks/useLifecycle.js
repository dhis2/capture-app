// @flow
import { useLocationQuery } from '../../../../utils/routing';
import { useCurrentOrgUnitInfo } from '../../../../hooks/useCurrentOrgUnitInfo';
import { getTrackerProgramThrowIfNotFound } from '../../../../metaData';
import { useRegistrationFormInfoForSelectedScope } from '../../common/useRegistrationFormInfoForSelectedScope';
import { useFormValues, useTrackedEntityInstances, useClientAttributesWithSubvalues } from './index';

export const useLifecycle = ({ selectedScopeId }: { selectedScopeId: string }) => {
    const { teiId, programId } = useLocationQuery();
    const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const program = getTrackerProgramThrowIfNotFound(programId);
    const orgUnit = useCurrentOrgUnitInfo();
    const {
        loading: trackedEntityInstancesLoading,
        trackedEntityInstances,
        error: trackedEntityInstancesError,
    } = useTrackedEntityInstances(teiId, programId);
    const clientAttributesWithSubvalues = useClientAttributesWithSubvalues(program, trackedEntityInstances);

    const { formValues, clientValues } = useFormValues({ formFoundation, clientAttributesWithSubvalues, orgUnit });
    console.log(clientAttributesWithSubvalues);

    // const formValues = {
    //     XH2qFfTfRTB: undefined,
    //     cejWyOfXge6: 'Male',
    //     lZGmxYbs97q: '7607463',
    //     vTKipVM0GsX: undefined,
    //     w75KJ2mc4zz: 'John',
    //     zDhUuAYrxNC: 'Kelly',
    // };

    return {
        formValues,
        clientValues,
        formId,
        formFoundation,
        selectedOrgUnitId: orgUnit.id,
    };
};
