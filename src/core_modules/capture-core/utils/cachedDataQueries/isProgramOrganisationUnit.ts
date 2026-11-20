import type { QueryClient } from '@tanstack/react-query';
import { IndexedDBNamespace } from '../reactQueryHelpers/reactQueryHelpers.const';
import {
    getUserMetadataStorageController,
    USER_METADATA_STORES,
} from '../../storageControllers';

type QueryInput = {
    queryClient: QueryClient,
    programId: string,
    orgUnitId: string,
};

export const isProgramOrganisationUnit = ({
    queryClient,
    programId,
    orgUnitId,
}: QueryInput) => queryClient.fetchQuery({
    queryKey: [...IndexedDBNamespace, 'programOrgUnit', programId, orgUnitId],
    queryFn: () => getUserMetadataStorageController().get(
        USER_METADATA_STORES.ORGANISATION_UNITS_BY_PROGRAM,
        programId,
        {
            project: cachedProgramOrgUnits => cachedProgramOrgUnits.organisationUnits[orgUnitId] || false,
        },
    ),
    staleTime: Infinity,
});
